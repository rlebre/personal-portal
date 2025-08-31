import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 font-mono">
      <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-sans bg-background text-foreground">
        <header className="flex flex-col items-center gap-4 mt-12">
          <Image
            className="rounded-full border border-gray-200 shadow-md"
            src="/avatar.png"
            alt="Profile avatar"
            width={120}
            height={120}
            priority
          />
          <h1 className="text-3xl font-bold">Rui Lebre</h1>
          <p className="text-lg text-muted-foreground">
            Software Engineer focused on web development.
          </p>
        </header>
        <main className="flex flex-col items-center gap-8 max-w-2xl w-full mt-8">
          <section className="text-center text-base leading-relaxed">
            <p>
              Hi! I&apos;m Rui Lebre, a software engineer currently working at
              Plex. Based in Portugal, I&apos;m passionate about technology,
              science, and the pursuit of new knowledge. Welcome to my personal
              website!
            </p>
          </section>
        </main>
        <footer className="mt-auto py-6 text-sm text-muted-foreground flex flex-col items-center gap-2">
          <span>
            © {new Date().getFullYear()} Rui Lebre. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}
