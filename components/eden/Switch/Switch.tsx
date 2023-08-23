import React, { InputHTMLAttributes, useState } from 'react';

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  data: string[];
  onChange: (value: any) => void;
}

const Switch = (props: Props) => {
  const { data, children, onChange, ...rest } = props;
  const [checked, setChecked] = useState<number>(0);

  const handleOnChange = (value: boolean) => {
    let target = checked + (value ? 1 : -1);
    if (target < 0) target = 0;
    else if (target >= data.length) target = data.length - 1;
    if (onChange) {
      onChange({ target });
    }
    setChecked(target);
    return null;
  };

  return (
    <div className="relative flex overflow-hidden w-[248px] h-16 rounded-[10px] bg-black px-8 py-4">
      <div
        className="w-[34px] cursor-pointer"
        onClick={() => handleOnChange(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="30"
          viewBox="0 0 26 30"
          fill="none"
        >
          <path
            d="M2.02723e-07 15L25.5 0.277569L25.5 29.7224L2.02723e-07 15Z"
            fill="#44D4A4"
          />
        </svg>
      </div>
      <div className="w-full relative overflow-hidden">
        <div
          className="transition-all duration-200 ease-in-out absolute inline-flex my-1"
          style={{ left: `-${checked * 124}px` }}
        >
          {data.map((row, index) => {
            return (
              <div
                key={index}
                className="w-[124px] text-center my-auto  uppercase text-[15px] text-semibold leading-[22px] "
              >
                {row}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="w-[34px] cursor-pointer"
        onClick={() => handleOnChange(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="38"
          viewBox="0 0 34 38"
          fill="none"
        >
          <g filter="url(#filter0_d_12_1566)">
            <path d="M30 15L4.5 29.7224L4.5 0.277567L30 15Z" fill="#44D4A4" />
          </g>
          <defs>
            <filter
              id="filter0_d_12_1566"
              x="0.5"
              y="0.277557"
              width="33.5"
              height="37.4449"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_12_1566"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_12_1566"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Switch;
