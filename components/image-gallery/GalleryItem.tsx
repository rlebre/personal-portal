import React from 'react';
import NextImage from 'next/image';
import useSWR from 'swr';

interface Props {
  imageUrl: string;
  onClick?: () => void;
}

interface IProcessedImage {
  width: number;
  height: number;
  src: string;
}

const processImage = async (imageUrl: string) => {
  const imagePromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () =>
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        src: imageUrl,
      });
    img.onerror = (error) => reject(error);
  });

  return await imagePromise;
};

const GalleryItem = ({ imageUrl, onClick }: Props) => {
  const { data } = useSWR(imageUrl, processImage) as { data: IProcessedImage };

  return (
    <div
      className='w-full rounded flex justify-center items-center shadow-md hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-200 bg-gray-100 mb-3 max-h-screen cursor-pointer'
      onClick={onClick}
    >
      {data && (
        <NextImage
          src={data.src}
          alt='image'
          width={data.width}
          height={data.height}
          loading='eager'
          className='rounded'
        />
      )}
    </div>
  );
};

export default GalleryItem;
