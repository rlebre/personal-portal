import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './SocialButton.module.scss';

interface Props {
  icon: IconDefinition;
  link: string;
  newPage?: boolean;
  name: string;
}

export const SocialButton = ({ name, icon, link, newPage }: Props) => {
  return (
    <a
      className={styles.btn__social}
      href={link}
      target={newPage ? '_blank' : '_parent'}
      rel='noreferrer'
      aria-label={name}
    >
      <FontAwesomeIcon icon={icon} className='w-6 text-gray-500' />
    </a>
  );
};
