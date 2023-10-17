import React, { useEffect } from 'react';

export const useClickOutside = (ref: React.MutableRefObject<HTMLDivElement>, callback: () => void) => {
  const handleWindowClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    if (ref.current && !ref.current.contains(target) && ref.current !== e.target) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleWindowClick);
    document.addEventListener('scroll', callback);

    return () => {
      document.removeEventListener('mousedown', handleWindowClick);
      document.removeEventListener('scroll', callback);
    };
  });
};
