import { Github, Linkedin, Instagram, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
};

export type SocialLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/hobbies", label: "Hobbies" },
  { href: "/academic", label: "Academic" },
];

export const socialLinks: SocialLink[] = [
  {
    href: "https://github.com/rlebre",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/ruilebre",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://instagram.com/ruilebre",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://orcid.org/0000-0002-3230-0732",
    label: "ORCID",
    icon: Globe,
  },
];
