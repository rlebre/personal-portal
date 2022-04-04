import { useRouter } from 'next/router';
import React from 'react';
import styles from './navbar.module.scss';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className={`${styles.navbar} w-full`}>
      <div className='flex flex-col'>
        <div className={`${styles.sidebar__header} ${styles.sidebar__header__expanded}`}>
          <h1 className={styles.sidebar__header__logo} onClick={() => router.push('/')}>
            Rui <span className='text-gray-700 font-extrabold'>Lebre</span>
          </h1>
        </div>
        <div className={styles.separator__wrapper}>
          <span className={styles.separator} />
        </div>
      </div>

      {/* <div className='hidden md:flex gap-4 items-center'>
        <FontAwesomeIcon icon={faSwatchbook} className='h-5 text-gray-500' />
        <FontAwesomeIcon icon={faToggleOn} className='w-6 text-gray-500' />
      </div> */}
    </nav>
  );
};

export default Navbar;
