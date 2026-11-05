"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { interpolate } from "@/lib/locale";
import s from "./CopyEmail.module.css";

/**
 * The address as a mailto link plus a Copy button. If the clipboard is unavailable or refuses,
 * the address is selected instead and the toast says how to copy it (never "copied").
 * `failed` is a template with a `{key}` placeholder for the platform's copy shortcut.
 */
export function CopyEmail({ email, label, copied, failed }: { email: string; label: string; copied: string; failed: string }) {
  const code = useRef<HTMLElement>(null);
  const selectText = () => {
    if (!code.current) return;
    const r = document.createRange();
    r.selectNodeContents(code.current);
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast(copied);
    } catch {
      selectText();
      const mac = /Mac|iPhone|iPad/.test(navigator.userAgent);
      showToast(interpolate(failed, { key: mac ? "Cmd+C" : "Ctrl+C" }));
    }
  };
  return (
    <div className={s.email}>
      <code ref={code}>
        <a href={`mailto:${email}`}>{email}</a>
      </code>
      <Button size="sm" onClick={copy}>
        {label}
      </Button>
    </div>
  );
}
