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
    }
  };

  const handleClick = () => {
    if (!open) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }

    handleOpen();
  };

  const handleOutsideClick = (e: any) => {
    if (!ref.current?.contains(e.target)) handleClick();
  };

  return (
    <>
      <div className="w-full rounded">
        <img src={src} alt="image" onClick={handleOpen} />
      </div>
      {
        open ?
          <div ref={ref}>
            <div className="flex items-center shrink-0 p-4 text-blue-gray-900 antialiased font-sans text-2xl font-semibold leading-snug justify-between" >
              <div className="flex items-center gap-3">
                <img
                  alt="tania andrew"
                  className='inline-block relative object-cover object-center !rounded-full w-9 h-9 rounded-md'
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                />
                <div className="-mt-px flex flex-col">
                  <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-medium">
                    Tania Andrew
                  </p>
                  <p className="block antialiased font-sans text-gray-700 text-xs font-normal">
                    @canwu
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className='align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg bg-green-500 text-white shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'
                  onClick={() => { download() }}
                >
                  {loading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 animate-spin"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  ) : (
                    "Free Download"
                  )}
                </button>
              </div>
            </div >
            <div className="relative text-blue-gray-500 antialiased font-sans text-base font-light leading-relaxed border-t border-t-blue-gray-100 border-b border-b-blue-gray-100 p-0">
              <img
                alt="nature"
                className="h-[48rem] w-full object-cover object-center"
                src="https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2717&q=80"
              />
            </div>
            <div className="flex items-center shrink-0 flex-wrap p-4 text-blue-gray-500 justify-between">
              <div className="flex items-center gap-16">
                <div>
                  <p className="block antialiased font-sans text-sm leading-normal text-gray-700 font-normal">
                    Prompt
                  </p>
                  <p color="blue-gray" className="block antialiased font-sans text-base leading-relaxed text-blue-gray-900 font-medium">
                    {prompt}
                  </p>
                </div>
                {
                  created && <div>
                    <p className="block antialiased font-sans text-sm leading-normal text-gray-700 font-normal">
                      Created
                    </p>
                    <p color="blue-gray" className="block antialiased font-sans text-base leading-relaxed text-blue-gray-900 font-medium">
                      {created}
                    </p>
                  </div>
                }
              </div>
              <button
                className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-4 rounded-lg border border-blue-gray-500 text-blue-gray-500 hover:opacity-75 focus:ring focus:ring-blue-gray-200 active:opacity-[0.85] flex items-center gap-3"
              >
                Share
              </button>
            </div>
          </div >
          : <></>
      }
    </>
  )
}

export default ImageModal