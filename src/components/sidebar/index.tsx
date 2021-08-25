import { useRouter } from 'next/router';
import React from 'react';
import styles from './sidebar.module.scss';

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className={`${styles.sidebar} ${styles.sidebar__big}`}>
      <div className={`${styles.sidebar__header}  ${styles.sidebar__header__expanded}`}>
        <h1 className={styles.sidebar__header__logo} onClick={() => router.push('/')}>
          Rui <span className='text-gray-700 font-extrabold'>Lebre</span>
        </h1>
      </div>
      <div className={styles.sidebar__separator__wrapper}>
        <span className={styles.sidebar__separator} />
      </div>
    </div>
  );
};

export default Sidebar;
