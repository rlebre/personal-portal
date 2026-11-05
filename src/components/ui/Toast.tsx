"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "./Button";
import s from "./Toast.module.css";

const EVENT = "rl-toast";
const DURATION = 3200;

/** Show a message in the page's Toaster. Safe to call from any client code. */
export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

/**
 * The single toast outlet. Render once, near the end of <body>.
 * Screen readers get a visually hidden role="status" region that exists from the first render
 * (live regions added later are often missed); each toast is a new keyed node inside it, so the
 * same message twice is announced twice. The visible pill is aria-hidden to avoid a double read.
 */
export function Toaster() {
  // `shown` flips off when the toast times out; `msg` stays so the pill can fade out with its text.
  const [toast, setToast] = useState<{ msg: string; n: number; shown: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const on = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail;
      setToast((prev) => ({ msg, n: (prev?.n ?? 0) + 1, shown: true }));
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast((prev) => prev && { ...prev, shown: false }), DURATION);
    };
    window.addEventListener(EVENT, on);
    return () => {
      window.removeEventListener(EVENT, on);
      clearTimeout(timer.current);
    };
  }, []);
  const shown = !!toast?.shown && !!toast.msg;
  return (
    <>
      <div className="sr-only" role="status" aria-atomic="true" data-toast-status="">
        {shown && <span key={toast!.n}>{toast!.msg}</span>}
      </div>
      <div className={s.toast} aria-hidden="true" hidden={!shown}>
        {toast?.msg}
      </div>
    </>
  );
}

/** A Button that only shows a toast: for links that aren't available yet (CV, thesis). */
export function ToastButton({ message, variant, size, children }: { message: string; variant?: ButtonVariant; size?: ButtonSize; children: ReactNode }) {
  return (
    <Button variant={variant} size={size} onClick={() => showToast(message)}>
      {children}
    </Button>
  );
}
