import React, { InputHTMLAttributes, useState } from 'react';

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  data: string[];
  onChange: (value: any) => void;
}

const Resolution = (props: Props) => {
  const { data, children, onChange, ...rest } = props;
  const [checked, setChecked] = useState<number>(0);

  const handleOnChange = (e: any, index: number) => {
    if (onChange) {
      onChange({ label: e.target.value, value: index });
    }
    setChecked(index);
    return null;
  };

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full grid gap-2 grid-cols-2">
        {data.map((row, index) => {
          return (
            <option
              key={index}
              onClick={(e: any) => handleOnChange(e, index)}
              className={`${
                checked === index
                  ? 'bg-[#44d4a43b] border-[1px] border-[#44D4A4]'
                  : 'hover:bg-[#141c2b]'
              } transition ease-in-out delay-150 text-center py-2 text-xs w-full cursor-pointer rounded-[5px] border-[1px] border-[#242C3E] bg-[#0B0F17]`}
            >
              {row}
            </option>
          );
        })}
      </div>
    </div>
  );
};

export default Resolution;
