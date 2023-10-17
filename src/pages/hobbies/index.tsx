import fs from 'fs';
import path from 'path';
import React from 'react';
import ImageGallery from '../../components/image-gallery';

interface Props {
  images: string[];
}

const Hobbies = ({ images }: Props) => {
  return (
    <div className='container flex flex-col px-5 md:px-20 mb-20 gap-6 max-w-[1024px] m-auto'>
      <h2 className='text-4xl md:text-5xl text-gray-600 font-mono font-bold tracking-widest'>Hobbies</h2>

      <span className='flex-wrap w-full text-justify lg:w-3/4 text-gray-500 tracking-wide'>
        As a computer and software engineer, I spend a lot of my time during the day behind my screens. I constantly try
        to get out and stay in contact with nature and the environment. During working days, unless abnormal event, I do
        not exempt from daily exercise. Whether it be walking, cycling, swimming, or just a little bit of gym classes.
      </span>

      <span className='flex-wrap w-full text-justify lg:w-3/4 text-gray-500 tracking-wide'>
        When the weekend approaches, I start doing my plans to go hiking in the mountain, surf, spend time with my
        family, or just relax. Honestly, often relaxing is replaced by learning new things related to software
        engineering (mostly frontend) or just learning a new language (german). In fact, I really enjoy learning new
        things, which makes it also a hobby for me.
      </span>

      <span className='flex-wrap w-full text-justify lg:w-3/4 text-gray-500 tracking-wide'>
        In this section, I show some pictures from my other hobby: photography. Hope you enjoyed to know a bit more
        about me!
      </span>

      <ImageGallery images={images} />
    </div>
  );
};

export const getStaticProps = async () => {
  const imagesPath = path.join(process.cwd(), 'public/images/hobbies');
  const fileList = fs.readdirSync(imagesPath, 'utf8').map((p) => `/images/hobbies/${p}`);

  return {
    props: {
      images: fileList,
    },
  };
};

export default Hobbies;
