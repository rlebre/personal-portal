/** The "R" inside two contour rings with one accent arc. Also the favicon (app/icon.svg). */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="var(--contour-index)" strokeWidth="1" />
      <circle cx="20" cy="20" r="15" fill="none" stroke="var(--contour-index)" strokeWidth="1" />
      <path d="M20 1.5 A18.5 18.5 0 0 1 38.5 20" fill="none" stroke="var(--trail)" strokeWidth="2" strokeLinecap="round" />
      <text x="20" y="26.5" textAnchor="middle" fontFamily="var(--f-display)" fontWeight="800" fontSize="18" fill="var(--ink)">
        R
      </text>
    </svg>
  );
}
