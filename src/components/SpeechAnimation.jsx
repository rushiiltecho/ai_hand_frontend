import React from 'react';

const SpeechAnimation = ({ color }) => {
  const colorClass =
    color === 'green' ? 'bg-green-500' : color === 'red' ? 'bg-red-500' : 'bg-gray-500';

  return (
    <div className="flex justify-center items-center space-x-2 mt-2">
      <div className={`${colorClass} h-4 w-4 rounded-full animate-bounce`}></div>
      <div className={`${colorClass} h-4 w-4 rounded-full animate-bounce200`}></div>
      <div className={`${colorClass} h-4 w-4 rounded-full animate-bounce400`}></div>
    </div>
  );
};

export default SpeechAnimation;
