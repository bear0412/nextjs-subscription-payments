import React from 'react';
import './ScreenSpinner.css';

interface Props {
  loading: boolean;
}

const ScreenSpinner = (props: Props) => {
  const { loading } = props;
  return (
    <div
      className={`${
        loading ? 'backdrop-blur-sm bg-white/30 w-full h-full z-50' : 'hidden'
      } absolute transition duration-150 ease-in-out py-auto flex items-center justify-center`}
    >
      <div className="spinner"></div>
    </div>
  );
};

export default ScreenSpinner;
