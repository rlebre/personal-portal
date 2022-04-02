import { faCamera, faCode, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import React from 'react';
import { CategoryButton } from '../category-button/category-button';
import styles from './sidebar.module.scss';

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className={`${styles.sidebar} ${styles.sidebar__big}`}>
      <div className={`${styles.sidebar__header} ${styles.sidebar__header__expanded}`}>
        <h1 className={styles.sidebar__header__logo} onClick={() => router.push('/')}>
          Rui <span className='text-gray-700 font-extrabold'>Lebre</span>
        </h1>
      </div>
      <div className={styles.sidebar__separator__wrapper}>
        <span className={styles.sidebar__separator} />
      </div>

      <div
        className='flex flex-col justify-center space-y-5 flex-shrink font-mono'
        style={{ width: '200px', marginLeft: '30px' }}
      >
        <CategoryButton icon={faGraduationCap} title='Academic' classNames='w-20 h-20' />

        <CategoryButton icon={faCode} title='Professional' />

        <CategoryButton icon={faCamera} title='Hobbies' />
      </div>
    </div>
  );
};

export default Sidebar;
