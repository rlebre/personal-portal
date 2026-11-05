import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import s from "./Article.module.css";

/** Article column plus a 220px sidebar (the TOC); one column below 980px. */
export function ArticleLayout({ children }: { children: ReactNode }) {
  return <Container className={s.layout}>{children}</Container>;
}

/** Mono breadcrumb line above the post title. */
export function ArticleCrumbs({ children }: { children: ReactNode }) {
  return <p className={s.crumbs}>{children}</p>;
}

/** The post body: typographic styles for MDX output (headings, figures, quotes). */
export function Article({ id, lang, children }: { id: string; lang: string; children: ReactNode }) {
  return (
    <article className={s.prose} id={id} lang={lang}>
      {children}
    </article>
  );
}

/** Author card at the end of an Article. */
export function ArticleAuthor({ image, name, bio, lang }: { image: StaticImageData; name: string; bio: string; lang: string }) {
  return (
    <Card className={s.author} lang={lang}>
      <Image src={image} alt="" width={56} height={56} />
      <div>
        <b>{name}</b>
        <p>{bio}</p>
      </div>
    </Card>
  );
}
