"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { ArrowLeft, Download, LinkIcon, ShareIcon } from "@/components/ui/icons";
import { interpolate } from "@/lib/locale";
import s from "./CvViewer.module.css";

export type CvLabels = {
  view: string;
  title: string;
  back: string;
  download: string;
  copy: string;
  copied: string;
  /** Template with `{url}`. */
  copyfail: string;
  share: string;
  open: string;
  alt: string;
  note: string;
};

type Props = {
  /** Same-origin path of the PDF (download, share as a file, "open"). */
  pdf: string;
  /** Absolute URL of the PDF (copy link, share as a link). */
  url: string;
  page: { src: string; width: number; height: number };
  labels: CvLabels;
  icon: ReactNode;
};

const noop = () => () => {};

/**
 * "View CV": a link to the PDF that, with JS, opens an in-page viewer instead: a modal (full screen
 * on phones) showing the PDF's page as an image, with Back, Share, Copy link and Download. Opening it
 * adds a history entry, so the phone's back gesture closes it rather than leaving the page.
 *
 * Inside a modal dialog the rest of the page is inert, so the site toast (outside it) would be
 * neither visible nor announced: the copy result shows on the button and in a status region here.
 */
export function CvViewer({ pdf, url, page, labels, icon }: Props) {
  const [open, setOpen] = useState(false);
  // Web Share support never changes: false on the server, the real answer after hydration.
  const canShare = useSyncExternalStore(
    noop,
    () => typeof navigator.share === "function",
    () => false,
  );
  const [status, setStatus] = useState("");
  const trigger = useRef<HTMLAnchorElement>(null);
  /** Whether the history entry this viewer pushed is the current one. */
  const pushed = useRef(false);
  /** The PDF as a File, fetched on open, so Share can attach it without awaiting a download first
   *  (Safari only allows share() close to the tap). */
  const file = useRef<File | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const titleId = useId();

  useEffect(() => {
    // Back (button, gesture, Alt+←) while open: the entry is already gone, just close.
    const onPop = () => {
      if (!pushed.current) return;
      pushed.current = false;
      setOpen(false);
    };
    addEventListener("popstate", onPop);
    return () => {
      removeEventListener("popstate", onPop);
      clearTimeout(statusTimer.current);
    };
  }, []);

  const show = (e: MouseEvent) => {
    // Let modified clicks (new tab, download) reach the PDF link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    history.pushState({ ...history.state, cv: true }, "");
    pushed.current = true;
    setStatus("");
    setOpen(true);
    if (canShare && !file.current)
      fetch(pdf)
        .then((r) => (r.ok ? r.blob() : Promise.reject()))
        .then((b) => (file.current = new File([b], pdf.split("/").pop()!, { type: "application/pdf" })))
        .catch(() => {});
  };

  const onClose = () => {
    setOpen(false);
    trigger.current?.focus();
    // Closed from inside (Back, Escape): drop the entry we pushed.
    if (pushed.current) {
      pushed.current = false;
      history.back();
    }
  };

  const say = (msg: string) => {
    setStatus(msg);
    clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatus(""), 3200);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      say(labels.copied);
    } catch {
      say(interpolate(labels.copyfail, { url }));
    }
  };

  const share = async () => {
    const f = file.current;
    const data = f && navigator.canShare?.({ files: [f] }) ? { files: [f], title: labels.title } : { url, title: labels.title };
    try {
      await navigator.share(data);
    } catch (err) {
      // Dismissing the share sheet isn't an error; anything else falls back to copying the link.
      if ((err as Error).name !== "AbortError") await copy();
    }
  };

  return (
    <>
      <a ref={trigger} href={pdf} className={buttonClass({ variant: "primary" })} aria-haspopup="dialog" onClick={show}>
        {icon}
        <span>{labels.view}</span>
      </a>
      <Dialog open={open} onClose={onClose} className={s.viewer} aria-labelledby={titleId} closeOnBackdrop>
        <div className={s.bar}>
          <button type="button" className={buttonClass({}, s.back)} onClick={() => setOpen(false)}>
            <ArrowLeft />
            <span>{labels.back}</span>
          </button>
          <h2 id={titleId} className={s.title}>
            {labels.title}
          </h2>
          <div className={s.actions}>
            {canShare && (
              <button type="button" className={buttonClass({}, s.act)} onClick={share}>
                <ShareIcon />
                <span className={s.lbl}>{labels.share}</span>
              </button>
            )}
            <button type="button" className={buttonClass({}, s.act)} onClick={copy}>
              <LinkIcon />
              <span className={s.lbl}>{status === labels.copied ? labels.copied : labels.copy}</span>
            </button>
            <a className={buttonClass({ variant: "primary" }, s.act)} href={pdf} download>
              <Download />
              <span>{labels.download}</span>
            </a>
          </div>
          <p className="sr-only" role="status" aria-atomic="true">
            {status}
          </p>
        </div>
        {status && status !== labels.copied && (
          <p className={s.notice} aria-hidden="true">
            {status}
          </p>
        )}
        <div className={s.body}>
          {/* Lazy: a closed <dialog> is display:none, so the page image loads only when the viewer opens. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- one fixed image inside a native dialog */}
          <img className={s.page} src={page.src} width={page.width} height={page.height} alt={labels.alt} loading="lazy" decoding="async" />
          <p className={s.foot}>
            {labels.note}{" "}
            <a href={pdf} target="_blank" rel="noopener">
              {labels.open}
            </a>
          </p>
        </div>
      </Dialog>
    </>
  );
}
