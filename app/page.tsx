'use client';

import { TypeAnimation } from 'react-type-animation';
import {
  faCamera,
  faCode,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import { CategoryButton } from '../components/buttons/CategoryButton';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col px-4">
      <main className="h-full w-full space-y-8 md:space-y-16 flex flex-col justify-center font-mono">
        <h1 className="text-5xl md:text-7xl text-gray-600 text-center font-bold tracking-widest">
          Rui <span className="text-gray-700 font-extrabold">Lebre</span>
        </h1>

        <TypeAnimation
          sequence={[
            'Hi! I\'m Rui Lebre and I want to welcome you to my personal website. Based in Portugal, I\'m a software engineer, currently working at Plex. I consider myself passionate about technology, science, and learning new things.',
          ]}
          cursor={false}
          speed={85}
          className="max-w-[768px] md:min-h-[72px] mx-auto text-justify md:flex"
        />

        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-20 space-y-5 md:space-y-0 flex-shrink">
          <CategoryButton
            icon={faGraduationCap}
            title="Academic"
            href="/academic"
          />

          <CategoryButton
            icon={faCode}
            title="Professional"
            href="/professional"
          />

          <CategoryButton icon={faCamera} title="Hobbies" href="/hobbies" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
