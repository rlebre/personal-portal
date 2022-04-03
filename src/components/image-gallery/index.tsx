import React from 'react';
import GalleryItem from './gallery-item';

interface Props {
  images: string[];
}

const ImageGallery = ({ images }: Props) => {
  return (
    <div className='grid-cols-3 xl:grid-cols-4 space-y-2 md:space-y-0 md:grid md:gap-3'>
      {images.map((image, index) => {
        return index === 1 || index == 5 ? (
          <GalleryItem key={image} imageUrl={image} className='col-span-2 row-span-2 relative' />
        ) : (
          <GalleryItem key={image} imageUrl={image} />
        );
      })}
    </div>
  );
};

export default ImageGallery;
