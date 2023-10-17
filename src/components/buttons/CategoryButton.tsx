import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './CategoryButton.module.scss';

interface Props {
  icon: IconDefinition;
  title: string;
  onClick?: () => void;
  isExpandable?: boolean;
  className?: string;
}

export const CategoryButton = ({ icon, title, onClick, isExpandable, className }: Props) => {
  return (
    <button
      className={`${styles.btn} ${isExpandable ? '' : 'md:w-40 md:h-24 flex-col'} ${className ? className : ''} `}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className={styles.btn__icon} />
      <span className={`${isExpandable ? styles.btn__expanded : ''}`}>{title}</span>
    </button>
  );
};
