import Image from 'next/image';
import React from 'react';

interface Props {
  className?: string;
  imageUrl: string;
}

const GalleryItem = ({ className, imageUrl }: Props) => {
  return (
    <div
      className={`w-full rounded flex justify-center items-center shadow-md hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-200 bg-gray-100 md:p-5 max-h-screen ${
        className ? className : ''
      }`}
    >
      <Image
        src={imageUrl}
        alt='image'
        width='1000px'
        height='1000px'
        objectFit='contain'
        loading='eager'
        className='inset-0 rounded opacity-95 hover:opacity-100'
      />
    </div>
  );
};

export default GalleryItem;
