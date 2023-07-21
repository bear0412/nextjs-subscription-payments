import React, { InputHTMLAttributes, useState } from 'react';

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  labels: string[],
  onChange: (value: boolean) => void;
}

const Toggle = (props: Props) => {
  const [checked, setChecked] = useState<boolean>(false);
  const { labels, children, onChange, ...rest } = props;
  let enabled: boolean = false;
  const handleOnChange = () => {
    if (onChange) {
      enabled != enabled;
      setChecked(enabled);
      onChange(enabled);
    }
    return null;
  };


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="flex">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            readOnly
          />
          <div
            onClick={(e) => {
              handleOnChange()
            }}
            className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
          ></div>
          <span className="ml-2 text-sm font-medium text-gray-900">
            {checked ? labels[0] : labels[1]}
          </span>
        </label>
      </div>
    </div>
  );
}

export default Toggle;