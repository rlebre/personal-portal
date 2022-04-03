import {
  faCamera,
  faCode,
  faGraduationCap,
  faSwatchbook,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import router from 'next/router';
import { useCallback, useState } from 'react';
import { CategoryButton } from '../components/category-button/category-button';
import Footer from '../components/footer';

export default function Home() {
  const [toogle, setToogle] = useState(false);

  const onClick = useCallback((route: string) => {
    router.push(route);
  }, []);

  return (
    <div className='h-screen w-screen flex flex-col'>
      <nav className='w-full h-8 flex justify-end gap-4 p-4 mt-4 items-center'>
        <FontAwesomeIcon icon={faSwatchbook} className='h-5 text-gray-500' />
        <button onClick={() => setToogle(!toogle)}>
          <FontAwesomeIcon icon={toogle ? faToggleOff : faToggleOn} className='w-6 text-gray-500' />
        </button>
      </nav>

      <main className='h-full w-full md:space-y-32 flex flex-col justify-center'>
        <h1 className='text-5xl md:text-7xl text-gray-600 text-center my-8 font-mono font-bold tracking-widest'>
          Rui <span className='text-gray-700 font-extrabold'>Lebre</span>
        </h1>

        <div className='flex flex-col items-center md:flex-row justify-center md:space-x-20 space-y-5 md:space-y-0 flex-shrink font-mono'>
          <CategoryButton icon={faGraduationCap} title='Academic' onClick={() => onClick('/academic')} />

          <CategoryButton icon={faCode} title='Professional' onClick={() => onClick('/professional')} />

          <CategoryButton icon={faCamera} title='Hobbies' onClick={() => onClick('/hobbies')} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
