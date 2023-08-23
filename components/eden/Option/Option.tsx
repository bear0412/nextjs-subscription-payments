import React, { InputHTMLAttributes, useState } from 'react';
import './Option.css';

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  data: string[];
  onChange: (value: string) => void;
}

const Option = (props: Props) => {
  const { data, children, onChange, ...rest } = props;
  const [checked, setChecked] = useState<number>(0);

  const handleOnChange = (e: any, index: number) => {
    if (onChange) {
      onChange(e.target.value);
    }
    setChecked(index);
    return null;
  };

  return (
    <div className="mt-4 relative flex flex-col items-center justify-center overflow-hidden">
      <div className="flex w-full justify-between">
        {data.map((row, index) => {
          return (
            <option
              key={index}
              onClick={(e: any) => handleOnChange(e, index)}
              className={`${
                checked === index ? 'font-bold text-[#44d4a4]' : ''
              } cursor-pointer`}
            >
              {row}
            </option>
          );
        })}
      </div>
      <div className="bg-[#282828] w-full h-4 rounded-full mt-2 overflow-hidden relative">
        <div
          style={{
            left:
              checked === 0
                ? '0.1px'
                : `calc(${(checked * 100) / (data.length - 1)}% - ${
                    (16 * checked) / (data.length - 1)
                  }px)`
          }}
          className="absolute z-20 w-4 h-4 shrink-0 rounded-full bg-white drop-shadow-2xl dot-animation"
        ></div>
        <div
          className={`${
            checked === data.length - 1
              ? 'w-full'
              : checked === 0
              ? 'w-[8px]'
              : `w-${checked}/${data.length - 1}`
          } h-4 slider-inside absolute slider-animation`}
        ></div>
      </div>
    </div>
  );
};

export default Option;
