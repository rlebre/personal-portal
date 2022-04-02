import React from 'react';
import GalleryItem from './gallery-item';

interface Props {
  images: string[];
}

const ImageGallery = ({ images }: Props) => {
  return (
    <div className='grid-cols-3 px-5 md:px-20 mb-20 space-y-2 md:space-y-0 md:grid md:gap-3'>
      {images.map((image, index) => {
        return index === 1 || index == 6 ? (
          <GalleryItem key={image} imageUrl={image} className='col-span-2 row-span-2' />
        ) : (
          <GalleryItem key={image} imageUrl={image} />
        );
      })}
    </div>
  );
};

export default ImageGallery;
