import React, { InputHTMLAttributes, useState } from 'react';
import BlurButton from '../BlurButton';
import BottomButton from '../BottomButton';
import Spinner from '../Spinner';

interface Props extends Omit<InputHTMLAttributes<any>, 'onChange'> {
  imageLinks: string[];
  buttons: string[];
  buttonMessageId: string;
  // onChange: (value: number) => void;
  // onUpscale: (value: any) => void;
  // onRegeneration: (value: any) => void;
  onSaveToGallery: (value: number) => void;
  onButtonClick: (button: string, buttonMessageId: string) => void;
}

const Card = (props: Props) => {
  const {
    imageLinks,
    buttons,
    children,
    buttonMessageId,
    onSaveToGallery,
    onButtonClick,
    ...rest
  } = props;
  const [selected, setSelected] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [downLoading, setDownLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  // const handleOnChange = (index: number) => {
  //   if (onChange) {
  //     onChange(index);
  //   }
  //   setSelected(imageLinks[index]);
  //   return null;
  // };
  const ButtonClicked = (e: any, btn: string) => {
    e.stopPropagation();
    onButtonClick(btn, buttonMessageId);
  };

  const handleDownload = async (e: any, value: string) => {
    e.stopPropagation();
    setDownLoading(true);
    try {
      const response = await fetch(value, {
        method: 'GET',
        headers: {}
      });
      const buffer = await response.arrayBuffer();
      const url = window.URL.createObjectURL(new Blob([buffer]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'image.png'); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
      setDownLoading(false);
    } finally {
      // handleOpen()
      setDownLoading(false);
    }
  };

  const handleSave = async (e: any, value: number) => {
    e.stopPropagation();
    setSaveLoading(true);
    try {
      await onSaveToGallery(value);
    } catch (error) {
      console.log('Save failed:', error);
      setSaveLoading(false);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="gap-2 w-full grid grid-rows-2 grid-cols-4 gap-4">
      <div className="aspect-square	items-center justify-center row-span-2 col-span-2 border-black border-4 rounded-[25px] shadow-xl bg-[#131313] p-2 overflow-hidden">
        <div
          className={`overflow-hidden aspect-square bg-[url(/back.png)] ${
            !imageLinks[selected] ? 'invert grayscale-[0.5]' : 'cursor-pointer'
          } bg-contain rounded-xl relative group`}
          onClick={() => {
            console.log('parent clicked');
          }}
        >
          {imageLinks[selected] && (
            <div className="h-full rounded-xl w-full z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 text-white">
              <div className="h-full transform-gpu relative m-4 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transform transition duration-300 ease-in-out">
                <div className="top-0 space-x-2 justify-end flex whitespace-nowrap">
                  <BlurButton
                    onClick={(e) => handleDownload(e, imageLinks[selected])}
                    loading={downLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 m-auto"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </BlurButton>
                  <BlurButton
                    onClick={(e) => handleSave(e, selected)}
                    loading={saveLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 m-auto"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </BlurButton>
                </div>

                <div className="absolute w-full bottom-8">
                  <div className="w-full flex space-x-2 justify-center whitespace-pre-line flex-wrap">
                    {buttons &&
                      buttons.map((btn, index) => {
                        return (
                          <BottomButton
                            className="mt-1"
                            onClick={(e) => ButtonClicked(e, btn)}
                            key={index}
                          >
                            <span className="m-auto">{btn}</span>
                          </BottomButton>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
          <img
            className="object-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out"
            src={imageLinks[selected]}
          ></img>
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, index) => {
        return (
          <div
            key={index}
            className="aspect-square items-center justify-center row-span-1 col-span-1 rounded-[20px] shadow-xl bg-[#131313] p-2 overflow-hidden"
          >
            <div
              className={`overflow-hidden aspect-square bg-[url(/back.png)] ${
                !imageLinks[index] ? 'invert grayscale-[0.5]' : 'cursor-pointer'
              } bg-contain rounded-xl relative group`}
              onClick={() => {
                setSelected(index);
              }}
            >
              {imageLinks[index] && (
                <div className="h-full rounded-xl w-full z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 pt-30 text-white">
                  <div>
                    <div className="transform-gpu h-full relative p-2 space-x-2 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out justify-end flex whitespace-nowrap">
                      <span className="h-4 w-4 drop-shadow-xl">{index}</span>
                      <span className="h-4 w-4 drop-shadow-xl">A</span>
                      <span className="h-4 w-4 drop-shadow-xl">B</span>
                    </div>
                  </div>
                </div>
              )}
              {imageLinks[index] ? (
                <img
                  alt=""
                  className="object-full aspect-square group-hover:scale-105 transition duration-300 ease-in-out"
                  src={imageLinks[index]}
                />
              ) : (
                <></>
              )}
            </div>
            {/* <Spinner /> */}
          </div>
        );
      })}
    </div>
  );
};

export default Card;
