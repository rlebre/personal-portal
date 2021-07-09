import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './social-button.module.scss';

interface Props {
  icon: IconDefinition;
  link: string;
  newPage?: boolean;
}

export const SocialButton = ({ icon, link, newPage }: Props) => {
  return (
    <a className={styles.btn__social} href={link} target={newPage ? '_blank' : '_parent'}>
      <FontAwesomeIcon icon={icon} className='w-6 text-gray-500' />
    </a>
  );
};
