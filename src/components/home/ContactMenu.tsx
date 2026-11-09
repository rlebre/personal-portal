"use client";

import { useId, useRef } from "react";
import { copyEmail, type CopyStrings } from "@/components/layout/CopyEmail";
import { buttonClass } from "@/components/ui/Button";
import { ChevronDown, CopyIcon, Mail } from "@/components/ui/icons";
import s from "./ContactMenu.module.css";

type Props = CopyStrings & { email: string; label: string; mailLabel: string; copyLabel: string };

/**
 * "Get in touch": a button that opens a small native popover with the address, a mailto link and
 * a copy action. The platform handles opening without JS, light dismiss, Escape and returning
 * focus to the button; CSS anchor positioning drops it under the button (centred where unsupported).
 */
export function ContactMenu({ email, label, mailLabel, copyLabel, ...strings }: Props) {
  const id = useId();
  const pop = useRef<HTMLDivElement>(null);
  const addr = useRef<HTMLElement>(null);
  const copy = async () => {
    await copyEmail(email, strings, addr.current);
    // Keep the panel open when copying failed: the selected address is in it.
    if (getSelection()?.toString() !== email) pop.current?.hidePopover();
  };
  return (
    <div className={s.wrap}>
      <button type="button" className={buttonClass({}, s.trigger)} popoverTarget={id}>
        {label}
        <ChevronDown className={s.chev} />
      </button>
      <div ref={pop} id={id} popover="auto" className={s.panel}>
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
