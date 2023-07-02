import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MutableRefObject, useRef } from 'react';
import styles from './category-button.module.scss';

interface Props {
  icon: IconDefinition;
  title: string;
  onClick?: () => void;
  className?: string;
}

export const CategoryButton = ({ icon, title, onClick, className }: Props) => {
  const ref = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>;

  return (
    <button ref={ref} className={`${styles.btn__category} ${className ? className : ''}`} onClick={onClick}>
      <FontAwesomeIcon icon={icon} className='w-6' />
      <span className={styles.btn__title}>{title}</span>
    </button>
  );
};
