/** Joins class names, skipping falsy values: cx(s.root, active && s.active, className). */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
