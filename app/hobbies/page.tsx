import React from 'react';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import ImageGallery from '../../components/image-gallery/ImageGallery';
// import { ModalService } from '../../components/modal/service';

const getContent = async () => {
  const imagesPath = path.join(process.cwd(), 'public/images/hobbies');
  const fileList = fs
    .readdirSync(imagesPath, 'utf8')
    .map((p) => `/images/hobbies/${p}`);

  const contentPath = path.join(process.cwd(), 'public/content/hobbies.md');
  const readFile = fs.readFileSync(contentPath, 'utf8');
  const { data: metadata, content } = matter(readFile);

  return {
    images: fileList,
    metadata,
    content,
  };
};

const Hobbies = async () => {
  const { images, metadata, content } = await getContent();
  return (
    <div className="container flex flex-col px-5 md:px-20 mb-20 gap-6 max-w-[1024px] m-auto">
      <h2 className="text-4xl md:text-5xl text-gray-600 font-mono font-bold tracking-widest">
        {metadata.title}
      </h2>

      <span className="flex-wrap w-full text-justify text-gray-500 tracking-wide whitespace-pre-line">
        {content}
      </span>

      <ImageGallery images={images} />
    </div>
  );
};

export default Hobbies;
