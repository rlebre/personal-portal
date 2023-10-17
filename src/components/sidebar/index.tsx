import { faCamera, faCode, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import React from 'react';
import { CategoryButton } from '../button/category-button';
import Footer from '../footer';
import styles from './sidebar.module.scss';

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className='flex justify-between shadow-md items-center md:px-20'>
      <div className={`${styles.sidebar} ${styles.sidebar__big}`}>
        <div className={`${styles.sidebar__header} ${styles.sidebar__header__expanded}`}>
          <h1 className={styles.sidebar__header__logo} onClick={() => router.push('/')}>
            Rui <span className='text-gray-700 font-extrabold'>Lebre</span>
          </h1>
        </div>

        <div className={styles.sidebar__separator__wrapper}>
          <span className={styles.sidebar__separator} />
        </div>

        <div className='flex justify-center items-center gap-4 p-2 w-full lg:w-fit bg-gray-50 '>
          <CategoryButton
            icon={faGraduationCap}
            title='Academic'
            className='w-32'
            onClick={() => router.push('/academic')}
          />

          <CategoryButton icon={faCode} title='Professional' onClick={() => router.push('/professional')} />

          <CategoryButton icon={faCamera} title='Hobbies' onClick={() => router.push('/hobbies')} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
