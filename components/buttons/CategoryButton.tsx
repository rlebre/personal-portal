'use client';

import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

import styles from './CategoryButton.module.scss';

interface Props {
  icon: IconDefinition;
  title: string;
  href: string;
  isExpandable?: boolean;
  className?: string;
}

export const CategoryButton = ({
  icon,
  title,
  href,
  isExpandable,
  className,
}: Props) => {
  const router = useRouter();

  return (
    <button
      className={`${styles.btn} ${
        isExpandable ? '' : 'w-40 md:h-24 flex-col'
      } ${className ? className : ''} `}
      onClick={() => router.push(href)}
    >
      <FontAwesomeIcon icon={icon} className={styles.btn__icon} />
      <span className={`${isExpandable ? styles.btn__expanded : ''}`}>
        {title}
      </span>
    </button>
  );
};
