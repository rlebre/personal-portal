import React, { useEffect } from 'react';

const Academic = () => {
  useEffect(() => {
    window.location.assign('https:/ruilebre.com/academic/');
  }, []);

  return (
    <div className='md:h-full flex justify-center items-center'>
      <div className='md:pb-32'>Academic</div>
    </div>
  );
};

export default Academic;
