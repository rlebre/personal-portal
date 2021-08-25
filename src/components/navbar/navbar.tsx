import { faTwitter, faLinkedinIn, faGithub, faOrcid, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faSwatchbook, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { SocialButton } from '../social-button/social-button';
import styles from './navbar.module.scss';

const Navbar = () => {
  return (
    <nav className={`${styles.navbar} w-full space-x-4`}>
      <FontAwesomeIcon icon={faSwatchbook} className='h-5 text-gray-500' />
      <FontAwesomeIcon icon={faToggleOn} className='w-6 text-gray-500' />

      <SocialButton icon={faTwitter} link='https://twitter.com/ralebre/' newPage />

      <SocialButton icon={faLinkedinIn} link='https://www.linkedin.com/in/rui-lebre-435279101/' newPage />

      <SocialButton icon={faGithub} link='https://github.com/rlebre/' newPage />

      <SocialButton icon={faOrcid} link='https://orcid.org/0000-0002-3230-0732' newPage />

      <SocialButton icon={faGoogle} link='https://scholar.google.com/citations?user=WtJeCMMAAAAJ&hl=en-US' newPage />
    </nav>
  );
};

export default Navbar;
