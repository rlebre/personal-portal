import Image from 'next/image';
import React from 'react';

interface Props {
  className?: string;
  imageUrl: string;
}

const GalleryItem = ({ className, imageUrl }: Props) => {
  return (
    <div
      className={`w-full rounded flex justify-center items-center hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-200 ${
        className ? className : ''
      }`}
    >
      <Image
        src={imageUrl}
        alt='image'
        width={'600px'}
        height={'600px'}
        className='inset-0 h-full object-cover object-center rounded opacity-95 hover:opacity-100 '
      />
    </div>
  );
};

export default GalleryItem;
