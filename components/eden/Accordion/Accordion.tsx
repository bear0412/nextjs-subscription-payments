import React, { InputHTMLAttributes, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

const Accordion: React.FC<Props> = ({ children }) => {
  const [visible, setVisible] = useState<boolean>(true);

  const onButtonClick = () => {
    setVisible(!visible);
  };

  return (
    <div className="justify-center overflow-hidden">
      <span className="cursor-pointer	">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 22 22"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`transition duration-300 ease-in-out ${
            visible ? 'rotate-180' : 'rotate-0 delay-300'
          } w-4 h-4 mx-auto `}
          onClick={onButtonClick}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </span>
      <div
        className={`${
          visible ? 'max-h-screen delay-300' : 'max-h-0'
        } transition-all duration-300 overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
