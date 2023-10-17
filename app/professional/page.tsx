import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Professional = () => {
  return (
    <div className='md:h-full flex justify-center items-center'>
      <div className='md:pb-32 w-full flex align-middle justify-center gap-4 text-gray-600'>
        <FontAwesomeIcon icon={faExclamationTriangle} className='h-32 text-orange-700'></FontAwesomeIcon>
        <span className='text-2xl font-bold flex items-center'>Work in progress...</span>
      </div>
    </div>
  );
};

export default Professional;
