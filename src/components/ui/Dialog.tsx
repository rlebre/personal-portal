"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

/**
 * Controlled native modal <dialog>: focus trapping, Escape and the inert background come from the
 * platform. `onClose` fires however it closes (Escape, backdrop click, `open={false}`), which is
 * where to return focus. Unstyled: pass `className` (the ::backdrop is styled through it).
 */
export function Dialog({
  open,
  onClose,
  closeOnBackdrop = true,
  onClick,
  ...rest
}: { open: boolean; onClose: () => void; closeOnBackdrop?: boolean } & Omit<ComponentPropsWithoutRef<"dialog">, "open" | "onClose">) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        onClick?.(e);
        if (closeOnBackdrop && e.target === e.currentTarget) e.currentTarget.close();
      }}
      {...rest}
    />
  );
}
