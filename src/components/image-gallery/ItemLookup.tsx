import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

import styles from './ItemLookup.module.scss';
import { ModalTypes } from '../modal/config';
import { ModalService } from '../modal/service';

const ItemLookup = () => {
  const [visible, setVisibility] = useState<boolean>(false);

  const type = useRef<ModalTypes>();
  const description = useRef<string>('');
  const title = useRef<string>('');

  const menuRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>;

  useClickOutside(menuRef, () => {
    hide();
  });

  const show = useCallback(() => {
    setVisibility(true);
  }, []);

  const hide = useCallback(() => {
    setVisibility(false);
  }, []);

  useEffect(() => {
    const onSuccess = (event: CustomEvent) => {
      const { title: eventTitle, description: eventDescription } = event.detail;
      description.current = eventDescription;
      title.current = eventTitle;
      type.current = ModalTypes.SUCCESS;
      visible && setVisibility(false);
      show();
    };

    ModalService.on(ModalTypes.SUCCESS, onSuccess);

    return () => {
      ModalService.off(ModalTypes.SUCCESS, onSuccess);
    };
  }, [show, visible]);

  return (
    <div
      onKeyDown={(e) => e.key === 'Escape' && setVisibility(false)}
      className={`${styles.modal} ${visible ? styles.modal__show : ''}`}
    >
      <div ref={menuRef} className={styles.modal__container}>
        <div className={styles.modal__content}>
          {title.current && <span className={styles.modal__title}>{title.current}</span>}
          {description.current && <span className={styles.modal__description}>{description.current}</span>}
        </div>

        <span
          role='button'
          tabIndex={0}
          className={styles.button}
          onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => e.key === 'Enter' && setVisibility(false)}
          onClick={hide}
        >
          OK
        </span>
      </div>
    </div>
  );
};

export default ItemLookup;
