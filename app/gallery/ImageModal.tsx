import React, { useState } from 'react';

interface Props {
  prompt: string;
  src: string;
  created: string | null;
}

const ImageModal = (props: Props) => {
  const { src, created, prompt } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const handleOpen = () => setOpen((cur) => !cur);

  const download = async () => {
    setLoading(true);
    console.log(src);
    try {
      const response = await fetch(src, {
        method: "GET",
        headers: {}
      })
      const buffer = await response.arrayBuffer()
      const url = window.URL.createObjectURL(new Blob([buffer]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "image.png"); //or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
      // handleOpen()
    }
  };

  return (
    <>
      <div className="w-full rounded">
        <img src={src} alt="image" onClick={handleOpen} />
      </div>
      {open ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Generated Avatar
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => handleOpen}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <img
                    alt="nature"
                    className="h-[48rem] w-full object-cover object-center"
                    src={src}
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleOpen}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={download}
                  >
                    Free Download
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default ImageModal