import React, { InputHTMLAttributes, useState, useEffect, useRef } from 'react';

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  data: string[];
  onChange: (value: any) => void;
}

const Select = (props: Props) => {
  const { data, children, onChange, ...rest } = props;
  const [checked, setChecked] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOnChange = (e: any, index: number) => {
    if (onChange) {
      onChange({ label: e.target.value, value: index });
    }
    setChecked(index);
    setVisible(false);
    return null;
  };

  const openList = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      ref={dropdownRef}
    >
      <button
        className="ring-0 inline-0 w-full h-10 pl-4 py-3 text-left bg-[#0B0F17] rounded-[6px] hover:bg-[#141c2b] text-[#9094A6] font-semibold	text-xs ring-shadow"
        onClick={openList}
      >
        {data[checked] ? data[checked] : ''}
        <span className="absolute right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 22 22"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`transition duration-200 ease-in-out ${
              visible ? 'rotate-180' : 'rotate-0'
            } w-4 h-4`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </button>
      <div
        className={`${
          visible ? 'max-h-32' : 'max-h-0'
        } transition-all delay-150 duration-300 overflow-hidden w-full text-[#9094A6] font-semibold	text-xs`}
      >
        {data.map((row, index) => {
          return (
            <option
              key={index}
              onClick={(e: any) => handleOnChange(e, index)}
              className={`${
                checked === index
                  ? 'bg-[#44d4a43b] border-[1px] border-[#44D4A4] text-white'
                  : 'hover:bg-[#141c2b]'
              } transition ease-in-out delay-150 text-left pl-4 h-10 py-2 text-xs w-full cursor-pointer rounded-[6px] border-[1px] border-[#242C3E] bg-[#0B0F17]`}
            >
              {row}
            </option>
          );
        })}
      </div>
    </div>
  );
};

export default Select;
