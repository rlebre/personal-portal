import { ImageResponse } from "next/og";
import { tokens } from "@/styles/tokens";

const c = tokens.color.light;

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Map-sheet OG card: contour rings, eyebrow, title, coordinates. Uses the default OG font. */
export function ogImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  const rings = [520, 420, 320, 220, 120];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: c.paper, color: c.ink, position: "relative" }}>
        {rings.map((r, i) => (
          <div key={r} style={{ position: "absolute", right: -r / 2 + 160, top: -r / 2 + 200, width: r, height: r, borderRadius: r, border: `${i % 2 ? 1.5 : 3}px solid ${i % 2 ? c.contour : c["contour-index"]}` }} />
        ))}
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: c["ink-2"] }}>{eyebrow}</div>
        <div style={{ display: "flex", fontSize: title.length > 40 ? 64 : 84, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: c["ink-2"] }}>
          <span style={{ color: c.trail, fontWeight: 700 }}>Rui Lebre</span>
          <span>40°38′N 8°39′W · ruilebre.com</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
