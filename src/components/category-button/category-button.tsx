import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MutableRefObject, useRef } from 'react';
import styles from './category-button.module.scss';

interface Props {
  icon: IconDefinition;
  title: string;
  onClick?: () => void;
  classNames?: string;
}

export const CategoryButton = ({ icon, title, onClick, classNames }: Props) => {
  const ref = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;

  return (
    <div ref={ref} className={`${styles.btn__category} ${classNames}`} onClick={onClick}>
      <FontAwesomeIcon icon={icon} className='w-6' />
      <span>{title}</span>
    </div>
  );
};
