import React, { useCallback } from 'react';
import GalleryItem from './GalleryItem';
import Masonry from 'react-masonry-css';
import ItemLookup from './ItemLookup';

interface Props {
  images: string[];
}

const ImageGallery = ({ images }: Props) => {
  const onItemClick = useCallback((index: number) => {
    console.log('clicked', index);
  }, []);

  return (
    <>
      <ItemLookup />

      <Masonry breakpointCols={{ default: 2, 768: 2, 640: 1 }} className='flex gap-3'>
        {images.map((image, index) => (
          <GalleryItem key={image} imageUrl={image} onClick={() => onItemClick(index)} />
        ))}
      </Masonry>
    </>
  );
};

export default ImageGallery;
