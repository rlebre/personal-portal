"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { navLinks, socialLinks } from "@/data/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleNavClick = () => {
    if (window.innerWidth < 768) setOpen(false);
  };

  const toggleDark = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded bg-muted text-foreground shadow"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        <span className="sr-only">Toggle sidebar</span>
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Sidebar */}
      <aside
        className={`h-[100vh] w-64 bg-background border-r border-r-border z-20 flex flex-col gap-2 p-6 transition-transform duration-200
          md:sticky md:top-0 md:left-0 md:block
          ${
            open
              ? "fixed top-0 left-0 translate-x-0"
              : "fixed top-0 left-0 -translate-x-full"
          } md:translate-x-0`}
        style={{ borderRightWidth: 1 }}
      >
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/avatar.png"
            alt="Rui Lebre avatar"
            width={64}
            height={64}
            className="rounded-full border border-gray-200 shadow-md"
            priority
          />
          <div className="mt-3 text-xl font-bold tracking-tight text-center">
            Rui Lebre
          </div>
        </div>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="mb-2">
            <button
              className="w-full py-2 px-4 rounded text-left hover:bg-muted font-medium cursor-pointer"
              onClick={handleNavClick}
            >
              {link.label}
            </button>
          </Link>
        ))}
        <div className="flex-1" />
        <div className="absolute left-0 bottom-0 w-full pb-6">
          <div className="w-full border-t border-border mb-4" />
          <div className="flex flex-row items-center justify-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <Icon className="w-6 h-6 hover:text-primary cursor-pointer" />
                </Link>
              );
            })}
            {mounted && (
              <button
                onClick={toggleDark}
                aria-label={
                  resolvedTheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer ml-2"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </aside>
      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
}
