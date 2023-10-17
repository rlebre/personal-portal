'use client';

import React from 'react';
import { faCamera, faCode, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

import { CategoryButton } from '../buttons/CategoryButton';

import styles from './Navbar.module.scss';

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className='flex justify-between shadow-sm items-center md:px-20 mb-8 md:mb-20 bg-slate-100'>
      <div className={`${styles.sidebar} ${styles.sidebar__big}`}>
        <div className={`${styles.sidebar__header} ${styles.sidebar__header__expanded}`}>
          <h1 className={styles.sidebar__header__logo} onClick={() => router.push('/')}>
            Rui <span className='text-gray-700 font-extrabold'>Lebre</span>
          </h1>
        </div>

        <div className={styles.sidebar__separator__wrapper}>
          <span className={styles.sidebar__separator} />
        </div>

        <div className='flex justify-center items-center gap-4 p-2 w-full lg:w-fit'>
          <CategoryButton
            icon={faGraduationCap}
            title='Academic'
            onClick={() => router.push('/academic')}
            isExpandable={true}
          />

          <CategoryButton
            icon={faCode}
            title='Professional'
            onClick={() => router.push('/professional')}
            isExpandable={true}
          />

          <CategoryButton icon={faCamera} title='Hobbies' onClick={() => router.push('/hobbies')} isExpandable={true} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
