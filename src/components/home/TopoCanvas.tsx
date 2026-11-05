"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TopoCanvas.module.css";

const STORE_KEY = "rl-motion";
const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};

/** Perlin noise with a shuffled permutation table. */
function makeNoise() {
  const p = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [p[i], p[j]] = [p[j], p[i]];
  }
  const P = new Uint8Array(512);
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const grad = (h: number, x: number, y: number) => {
    const g = h & 7;
    const u = g < 4 ? x : y;
    const v = g < 4 ? y : x;
    return (g & 1 ? -u : u) + (g & 2 ? -2 * v : 2 * v);
  };
  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const a = P[X] + Y;
    const b = P[X + 1] + Y;
    return (
      lerp(lerp(grad(P[a], x, y), grad(P[b], x - 1, y), u), lerp(grad(P[a + 1], x, y - 1), grad(P[b + 1], x - 1, y - 1), u), v) / 2.5
    );
  };
}

const HILLS: [number, number, number, number][] = [
  [0.78, 0.38, 0.22, 1],
  [0.58, 0.75, 0.16, 0.6],
  [0.95, 0.85, 0.12, 0.5],
  [0.35, 0.15, 0.18, 0.35],
];

/** Entrance timeline (ms from the first animated frame): trail, then the summit marker, then its label. */
const INTRO = { trail: 1200, markAt: 1150, mark: 260, labelAt: 1300, label: 350 } as const;
const INTRO_END = INTRO.labelAt + INTRO.label;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
/** Ease-out with a small overshoot, for the summit marker settling into place. */
const easeOutBack = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;

/**
 * Animated contour lines (marching squares over Perlin noise + gaussian hills), with a dashed
 * trail to a summit. Redraws at ~11 fps, pauses offscreen / in hidden tabs, and is static under
 * reduced motion unless the visitor explicitly presses Play. Fills its positioned parent (Hero);
 * `children` render between the canvas and the pause control. Purely decorative, so it stays out
 * of the critical path: nothing runs until the page has loaded and the main thread is idle, then
 * the canvas fades in. If it starts animating, the first ~1.6 s are an entrance: the dashed trail
 * draws up to the summit, the ▲ settles and the spot height fades in (the contours hold still
 * meanwhile, cached in a temporary layer, so only the trail redraws per frame). Paused, reduced or
 * offscreen at start, the full trail is simply drawn.
 */
export function TopoCanvas({ pauseLabel, playLabel, children }: { pauseLabel: string; playLabel: string; children?: React.ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [force, setForce] = useState(false);
  const controls = useRef<{ sync: () => void } | null>(null);
  const state = useRef({ userPaused: false, reduce: false, force: false });

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const paused = store.get(STORE_KEY) === "paused";
    state.current = { userPaused: paused, reduce: mq.matches, force: false };
    // Sync persisted/media state after mount (unknown during SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserPaused(paused);
    setReduce(mq.matches);
    const onMq = (e: MediaQueryListEvent) => {
      state.current.reduce = e.matches;
      setReduce(e.matches);
      controls.current?.sync();
    };
    mq.addEventListener("change", onMq);

    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const root = document.documentElement;
    const noise = makeNoise();
    let w = 0,
      h = 0,
      raf = 0,
      last = 0,
      time = Math.random() * 50,
      visible = true,
      started = false,
      // Entrance: -1 = not begun; `introDone` = full trail from now on.
      introAt = -1,
      introDone = false;
    let layer: HTMLCanvasElement | null = null;
    // The trail as a polyline with cumulative lengths, for drawing part of it (rebuilt on resize).
    let trailPts: number[] = [];
    let trailLen: number[] = [];
    let colors = { c: "", i: "", a: "", t: "", font: "" };

    const readColors = () => {
      const cs = getComputedStyle(root);
      const v = (n: string) => cs.getPropertyValue(n).trim();
      colors = { c: v("--contour"), i: v("--contour-index"), a: v("--trail"), t: v("--ink-2"), font: v("--f-mono") };
    };

    const field = (x: number, y: number, tm: number) => {
      const nx = x / w;
      const ny = (y / Math.max(h, 1)) * (h / w);
      let v = 0;
      for (const [hx, hy, s, a] of HILLS) {
        const dx = nx - hx;
        const dy = y / h - hy;
        v += a * Math.exp(-(dx * dx + dy * dy * 0.45) / (2 * s * s));
      }
      return v + 0.32 * noise(nx * 3.2 + tm * 0.05, ny * 3.2 - tm * 0.035) + 0.12 * noise(nx * 8 - tm * 0.02, ny * 8 + tm * 0.03);
    };

    const contours = (g: CanvasRenderingContext2D) => {
      const cell = w < 700 ? 12 : 14;
      const cols = Math.ceil(w / cell) + 1;
      const rows = Math.ceil(h / cell) + 1;
      const F = new Float32Array(cols * rows);
      let mn = 1e9,
        mx = -1e9;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const v = field(i * cell, j * cell, time);
          F[j * cols + i] = v;
          if (v < mn) mn = v;
          if (v > mx) mx = v;
        }
      const L = 16;
      for (let l = 1; l < L; l++) {
        const iso = mn + ((mx - mn) * l) / L;
        const index = l % 4 === 0;
        g.beginPath();
        g.strokeStyle = index ? colors.i : colors.c;
        g.lineWidth = index ? 1.5 : 1;
        for (let j = 0; j < rows - 1; j++)
          for (let i = 0; i < cols - 1; i++) {
            const a = F[j * cols + i],
              b = F[j * cols + i + 1],
              c = F[(j + 1) * cols + i + 1],
              d = F[(j + 1) * cols + i];
            const k = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
            if (k === 0 || k === 15) continue;
            const x = i * cell,
              y = j * cell;
            // Edge crossings as scalars (top x, right y, bottom x, left y): this runs for every cell of
            // every level ~11 times a second, so no per-cell arrays or closures.
            const tx = x + (cell * (iso - a)) / (b - a),
              ry = y + (cell * (iso - b)) / (c - b),
              bx = x + (cell * (iso - d)) / (c - d),
              ly = y + (cell * (iso - a)) / (d - a);
            const x1 = x + cell,
              y1 = y + cell;
            switch (k) {
              case 1: case 14: g.moveTo(x, ly); g.lineTo(bx, y1); break;
              case 2: case 13: g.moveTo(bx, y1); g.lineTo(x1, ry); break;
              case 3: case 12: g.moveTo(x, ly); g.lineTo(x1, ry); break;
              case 4: case 11: g.moveTo(tx, y); g.lineTo(x1, ry); break;
              case 5: g.moveTo(x, ly); g.lineTo(tx, y); g.moveTo(bx, y1); g.lineTo(x1, ry); break;
              case 6: case 9: g.moveTo(tx, y); g.lineTo(bx, y1); break;
              case 7: case 8: g.moveTo(x, ly); g.lineTo(tx, y); break;
              case 10: g.moveTo(x, ly); g.lineTo(bx, y1); g.moveTo(tx, y); g.lineTo(x1, ry); break;
            }
          }
        g.stroke();
      }
    };

    // Trail geometry: a cubic from below the bottom edge to the summit at (78%, 38%).
    const P = () => [w * 0.46, h * 1.02, w * 0.6, h * 0.85, w * 0.62, h * 0.5, w * 0.78, h * 0.38] as const;
    const buildTrail = () => {
      const [x0, y0, x1, y1, x2, y2, x3, y3] = P();
      trailPts = [];
      trailLen = [];
      let len = 0;
      for (let i = 0; i <= 48; i++) {
        const t = i / 48,
          u = 1 - t;
        const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
        const y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
        if (i) len += Math.hypot(x - trailPts[trailPts.length - 2], y - trailPts[trailPts.length - 1]);
        trailPts.push(x, y);
        trailLen.push(len);
      }
    };

    /** Dashed trail, summit marker and spot height; `e` = ms into the entrance (Infinity = complete). */
    const overlay = (c: CanvasRenderingContext2D, e: number) => {
      const [x0, y0, x1, y1, x2, y2, sx, sy] = P();
      c.save();
      c.setLineDash([6, 6]);
      c.strokeStyle = colors.a;
      c.lineWidth = 1.8;
      c.beginPath();
      c.moveTo(x0, y0);
      if (e >= INTRO.trail) c.bezierCurveTo(x1, y1, x2, y2, sx, sy);
      else if (trailLen.length) {
        // Part of the polyline, up to the eased share of its length.
        const target = easeInOut(clamp01(e / INTRO.trail)) * trailLen[trailLen.length - 1];
        for (let i = 1; i < trailLen.length; i++) {
          const px = trailPts[2 * i - 2],
            py = trailPts[2 * i - 1];
          if (trailLen[i] >= target) {
            const f = (target - trailLen[i - 1]) / (trailLen[i] - trailLen[i - 1] || 1);
            c.lineTo(px + (trailPts[2 * i] - px) * f, py + (trailPts[2 * i + 1] - py) * f);
            break;
          }
          c.lineTo(trailPts[2 * i], trailPts[2 * i + 1]);
        }
      }
      c.stroke();
      c.restore();
      const m = clamp01((e - INTRO.markAt) / INTRO.mark);
      if (m > 0) {
        const k = e === Infinity ? 1 : easeOutBack(m);
        c.fillStyle = colors.a;
        c.beginPath();
        c.moveTo(sx, sy - 7 * k);
        c.lineTo(sx + 7 * k, sy + 5 * k);
        c.lineTo(sx - 7 * k, sy + 5 * k);
        c.closePath();
        c.fill();
      }
      const a = clamp01((e - INTRO.labelAt) / INTRO.label);
      if (a > 0) {
        c.save();
        c.globalAlpha = a;
        c.fillStyle = colors.t;
        c.font = `500 11px ${colors.font || "monospace"}`;
        c.fillText("1527 m", sx + 12, sy + 4);
        c.restore();
      }
    };

    /** Ms into the entrance for the current frame. */
    const introElapsed = (now: number) => (introDone ? Infinity : introAt < 0 ? 0 : now - introAt);

    const draw = () => {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      contours(ctx);
      overlay(ctx, introElapsed(performance.now()));
    };

    /** Ends the entrance (finished, paused, hidden, resized or restyled): from now on the full trail. */
    const finishIntro = () => {
      if (introDone) return;
      introDone = true;
      if (layer) layer.width = layer.height = 0;
      layer = null;
    };

    /** One entrance frame: the cached contours plus the growing trail. */
    const introFrame = (ts: number) => {
      const e = ts - introAt;
      if (e >= INTRO_END) {
        finishIntro();
        last = ts;
        draw();
        return;
      }
      if (!layer) {
        layer = document.createElement("canvas");
        layer.width = cv.width;
        layer.height = cv.height;
        const lc = layer.getContext("2d")!;
        lc.setTransform(cv.width / w, 0, 0, cv.height / h, 0, 0);
        contours(lc);
      }
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(layer, 0, 0, w, h);
      overlay(ctx, e);
    };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTrail();
      if (introAt >= 0) finishIntro();
      draw();
      // First real frame is on the canvas: fade it in (CSS; instant under reduced motion).
      if (w && h) cv.dataset.ready = "";
    };

    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (!introDone) return introFrame(ts);
      if (ts - last < 90) return;
      const dt = Math.min(200, ts - last);
      last = ts;
      time += (dt / 1000) * 0.9;
      draw();
    };

    const running = () => {
      const s = state.current;
      return started && (!s.reduce || s.force) && !s.userPaused && visible && !document.hidden;
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (running()) {
        last = performance.now();
        if (!introDone && introAt < 0) introAt = last;
        raf = requestAnimationFrame(loop);
      } else if (started && !introDone) {
        // Not animating (reduced motion, paused, offscreen, hidden tab): no entrance, full trail.
        finishIntro();
        draw();
      }
    };
    controls.current = { sync };

    const restyle = () => {
      readColors();
      if (introAt >= 0) finishIntro();
      draw();
    };
    const darkMq = matchMedia("(prefers-color-scheme: dark)");
    let io: IntersectionObserver | undefined;
    let ro: ResizeObserver | undefined;
    let mo: MutationObserver | undefined;

    const start = () => {
      started = true;
      readColors();
      // The ResizeObserver's initial callback sizes the canvas and draws the first frame; the
      // IntersectionObserver's starts the loop (if motion is allowed and the hero is on screen).
      ro = new ResizeObserver(resize);
      ro.observe(cv);
      io = new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
        sync();
      });
      io.observe(cv);
      mo = new MutationObserver(restyle);
      mo.observe(root, { attributes: true, attributeFilter: ["data-theme", "class"] });
      darkMq.addEventListener("change", restyle);
      document.addEventListener("visibilitychange", sync);
      // The spot height label uses the mono font; redraw once it arrives if it hasn't yet.
      if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(restyle);
    };

    // Start after the load event, in an idle slot (or after 2 s at the latest). Safari has no
    // requestIdleCallback: a timeout after load is close enough there.
    const hasIdle = "requestIdleCallback" in window;
    const idle = (cb: () => void) => (hasIdle ? requestIdleCallback(cb, { timeout: 2000 }) : window.setTimeout(cb, 1));
    const cancelIdle = (id: number) => (hasIdle ? cancelIdleCallback(id) : window.clearTimeout(id));
    let idleId = 0;
    const schedule = () => {
      idleId = idle(start);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", schedule);
      cancelIdle(idleId);
      io?.disconnect();
      ro?.disconnect();
      mo?.disconnect();
      mq.removeEventListener("change", onMq);
      darkMq.removeEventListener("change", restyle);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const paused = userPaused || (reduce && !force);

  const onToggle = () => {
    const s = state.current;
    if (s.reduce && !s.force && !s.userPaused) s.force = true;
    else if (s.reduce && s.force) s.force = false;
    else s.userPaused = !s.userPaused;
    store.set(STORE_KEY, s.userPaused ? "paused" : "on");
    setUserPaused(s.userPaused);
    setForce(s.force);
    controls.current?.sync();
  };

  return (
    <>
      <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
      {children}
      <div className={styles.tools}>
        {/* No aria-pressed: the label itself flips between "Pause animation" and "Play animation". */}
        <button className={styles.pause} type="button" onClick={onToggle}>
          <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
          <span>{paused ? playLabel : pauseLabel}</span>
        </button>
      </div>
    </>
  );
}
