import fs from 'fs';
import path from 'path';
import React from 'react';
import ImageGallery from '../../components/image-gallery';

interface Props {
  images: string[];
}

const Hobbies = ({ images }: Props) => {
  return (
    <div className='md:h-full md:w-full block justify-center items-center'>
      <div className='md:pb-32'>
        <ImageGallery images={images} />
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const imagesPath = path.join(process.cwd(), 'public/images/hobbies');
  const fileList = fs.readdirSync(imagesPath, 'utf8').map((p) => `/images/hobbies/${p}`);

  console.log(fileList);
  return {
    props: {
      images: fileList,
    },
  };
};

export default Hobbies;
