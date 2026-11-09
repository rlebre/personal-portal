"use client";

import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import { copyEmail, type CopyStrings } from "@/components/layout/CopyEmail";
import { buttonClass } from "@/components/ui/Button";
import { ChevronDown, CopyIcon, Mail } from "@/components/ui/icons";
import s from "./ContactMenu.module.css";

type Props = CopyStrings & { email: string; label: string; mailLabel: string; copyLabel: string };

/**
 * "Get in touch": a button that opens a small native popover with the address, a mailto link and
 * a copy action. The platform gives opening without JS, light dismiss (outside click), Escape and
 * returning focus to the button; this adds focus on the first item when it opens, ↑/↓/Home/End
 * between items, and closing when focus leaves. CSS anchor positioning puts it under the button
 * (above when there's no room; centred where unsupported).
 */
export function ContactMenu({ email, label, mailLabel, copyLabel, ...strings }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const addr = useRef<HTMLElement>(null);

  const items = () => [...(pop.current?.querySelectorAll<HTMLElement>("a,button") ?? [])];

  useEffect(() => {
    const el = pop.current;
    if (!el) return;
    const onToggle = (e: Event) => {
      const isOpen = (e as ToggleEvent).newState === "open";
      setOpen(isOpen);
      if (isOpen) items()[0]?.focus();
    };
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    const next = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: list.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    list[(next + list.length) % list.length]?.focus();
  };

  // Focus leaving the panel (Tab past the last item, Shift+Tab before the first) closes it. Going
  // back to the button is left to the button's own toggle.
  const onBlur = (e: FocusEvent) => {
    const to = e.relatedTarget as Node | null;
    if (to && (pop.current?.contains(to) || to === trigger.current)) return;
    if (pop.current?.matches(":popover-open")) pop.current.hidePopover();
  };

  const copy = async () => {
    await copyEmail(email, strings, addr.current);
    // Keep the panel open when copying failed: the selected address is in it.
    if (getSelection()?.toString() !== email) pop.current?.hidePopover();
  };

  return (
    <div className={s.wrap}>
      <button ref={trigger} type="button" className={buttonClass({}, s.trigger)} popoverTarget={id} aria-expanded={open} aria-controls={id}>
        {label}
        <ChevronDown className={s.chev} />
      </button>
      <div ref={pop} id={id} popover="auto" className={s.panel} onKeyDown={onKeyDown} onBlur={onBlur}>
        <code ref={addr} className={s.addr}>
          {email}
        </code>
        <a className={s.item} href={`mailto:${email}`} onClick={() => pop.current?.hidePopover()}>
          <Mail />
          {mailLabel}
        </a>
        <button type="button" className={s.item} onClick={copy}>
          <CopyIcon />
          {copyLabel}
        </button>
      </div>
    </div>
  );
}
