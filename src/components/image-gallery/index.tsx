import React from 'react';
import GalleryItem from './gallery-item';
import Masonry from 'react-masonry-css';

interface Props {
  images: string[];
}

const ImageGallery = ({ images }: Props) => {
  return (
    <Masonry breakpointCols={{ default: 3, 768: 2, 640: 1 }} className='flex gap-3'>
      {images.map((image) => (
        <GalleryItem key={image} imageUrl={image} />
      ))}
    </Masonry>
  );
};

export default ImageGallery;
