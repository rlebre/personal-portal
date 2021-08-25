import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React, { MutableRefObject, Ref, useRef } from 'react';
import styles from './category-button.module.scss';

interface Props {
  icon: IconDefinition;
  title: string;
  onClick?: () => void;
}

export const CategoryButton = ({ icon, title, onClick }: Props) => {
  const ref = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
  const router = useRouter();

  return (
    <div ref={ref} className={styles.btn__category} onClick={onClick}>
      <FontAwesomeIcon icon={icon} className='w-6' />
      <span>{title}</span>
    </div>
  );
};
