import { faGithub, faGoogle, faLinkedinIn, faOrcid, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faSwatchbook, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React from 'react';
import { SocialButton } from '../social-button/social-button';
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

      <div className='hidden md:flex gap-4 items-center'>
        <FontAwesomeIcon icon={faSwatchbook} className='h-5 text-gray-500' />
        <FontAwesomeIcon icon={faToggleOn} className='w-6 text-gray-500' />

        <SocialButton icon={faTwitter} link='https://twitter.com/ralebre/' newPage />

        <SocialButton icon={faLinkedinIn} link='https://www.linkedin.com/in/rui-lebre-435279101/' newPage />

        <SocialButton icon={faGithub} link='https://github.com/rlebre/' newPage />

        <SocialButton icon={faOrcid} link='https://orcid.org/0000-0002-3230-0732' newPage />

        <SocialButton icon={faGoogle} link='https://scholar.google.com/citations?user=WtJeCMMAAAAJ&hl=en-US' newPage />
      </div>
    </nav>
  );
};

export default Navbar;
