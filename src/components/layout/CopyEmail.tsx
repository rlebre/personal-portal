"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { interpolate } from "@/lib/locale";
import s from "./CopyEmail.module.css";

export type CopyStrings = { copied: string; failed: string };

/**
 * Copies `email` and toasts `copied`. If the clipboard is unavailable or refuses, `fallback` (an
 * element showing the address) is selected instead and the toast says how to copy it (never
 * "copied"). `failed` is a template with a `{key}` placeholder for the platform's copy shortcut.
 */
export async function copyEmail(email: string, { copied, failed }: CopyStrings, fallback: HTMLElement | null) {
  try {
    await navigator.clipboard.writeText(email);
    showToast(copied);
  } catch {
    if (fallback) {
      const r = document.createRange();
      r.selectNodeContents(fallback);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
    }
    const mac = /Mac|iPhone|iPad/.test(navigator.userAgent);
    showToast(interpolate(failed, { key: mac ? "Cmd+C" : "Ctrl+C" }));
  }
}

/** The address as a mailto link plus a Copy button (see `copyEmail` for the fallback). */
export function CopyEmail({ email, label, ...strings }: { email: string; label: string } & CopyStrings) {
  const code = useRef<HTMLElement>(null);
  return (
    <div className={s.email}>
      <code ref={code}>
        <a href={`mailto:${email}`}>{email}</a>
      </code>
      <Button size="sm" onClick={() => copyEmail(email, strings, code.current)}>
        {label}
      </Button>
    </div>
  );
}
