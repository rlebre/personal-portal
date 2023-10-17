'use client';

import { useCallback } from 'react';
import {
  faCamera,
  faCode,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

import { CategoryButton } from '../components/buttons/CategoryButton';
import Footer from '../components/Footer';

export default function Home() {
  const router = useRouter();

  const onClick = useCallback((route: string) => {
    router.push(route);
  }, [router]);

  return (
    <div className="h-screen w-screen flex flex-col px-4">
      <main className="h-full w-full space-y-8 md:space-y-16 flex flex-col justify-center">
        <h1 className="text-5xl md:text-7xl text-gray-600 text-center font-mono font-bold tracking-widest">
          Rui <span className="text-gray-700 font-extrabold">Lebre</span>
        </h1>

        <span className="font-mono max-w-[768px] mx-auto text-justify hidden md:flex">
          Hi! I'm Rui Lebre and this is my personal website. I'm a software
          engineer and I'm currently working at Plex. I'm based in Portugal and
          I'm passionate about technology, science, and learning new things.
        </span>

        <div className="flex flex-col items-center md:flex-row justify-center md:space-x-20 space-y-5 md:space-y-0 flex-shrink font-mono">
          <CategoryButton
            icon={faGraduationCap}
            title="Academic"
            onClick={() => onClick('/academic')}
          />

          <CategoryButton
            icon={faCode}
            title="Professional"
            onClick={() => onClick('/professional')}
          />

          <CategoryButton
            icon={faCamera}
            title="Hobbies"
            onClick={() => onClick('/hobbies')}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
