'use client';

import { useEffect, useState } from "react";
import { useS3Upload } from "next-s3-upload";
import React from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  const handleFileChange = async (file: any) => {
    const res = await uploadToS3(file);
    const link = `https://s3.amazonaws.com/${res?.bucket}/${res?.key}`;
    setImageUrl(link);
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center ">
      <div className="col-span-full mt-2 w-[300px] h-[300px]">
        {/* Uplaoder */}
        <FileInput onChange={handleFileChange} />
        {!imageUrl && (
          <button
            onClick={openFileDialog}
            className="flex justify-center rounded-lg border border-dashed border-gray-900/25 w-full h-full px-auto pt-32 bg-gray-400"
          >
            Upload file
          </button>
        )}
        {imageUrl && (
          <>
            <button className="absolute text-black">x</button>
            <img
              src={imageUrl}
              className="flex justify-center rounded-lg border border-dashed border-gray-900/25 w-full h-full"
            />
          </>
        )}
      </div>
      {/* Text Prompt */}
      <div className="w-full mx-auto px-20">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Prompt
          </label>
          <div className="mt-2 flex space-x-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter your prompt here"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={async () => {
                setLoading(true);
                await (new Promise((resolve) => setTimeout(resolve, 500)));
                // try {
                //   let headers = {
                //     "Content-Type": "application/json",
                //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_NEXTLOG_TOKEN}`,
                //   };
                //   console.log(
                //     imageUrl +
                //       (accessory1 ? " " + accessory1 + "," : "") +
                //       (accessory2 ? " " + accessory2 + "," : "") +
                //       (accessory3 ? " " + accessory3 + "," : "") +
                //       " " +
                //       text
                //   );
                //   let r = await axios.post(
                //     `${process.env.NEXT_PUBLIC_NEXTLOG_URL}`,
                //     {
                //       cmd: "imagine",
                //       msg:
                //         imageUrl +
                //         (accessory1 ? " " + accessory1 + "," : "") +
                //         (accessory2 ? " " + accessory2 + "," : "") +
                //         (accessory3 ? " " + accessory3 + "," : "") +
                //         " " +
                //         text,
                //     },
                //     { headers }
                //   );

                //   setResponse(JSON.stringify(r.data, null, 2));
                // } catch (e: any) {
                //   setError(e.message);
                // }
                setLoading(false);
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
      {/* Every Values */}
      {/* <div className="w-full mx-auto px-20 flex">
        <div className="w-1/2 pr-2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Body
            </label>
            <div className="mt-2 flex space-x-2">
              <input
                value={accessory1}
                onChange={(e) => setAccessorys(e.target.value, 1)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your prompt here"
              />
            </div>
          </div>
        </div>
        <div className="w-1/2 pr-2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Hair
            </label>
            <div className="mt-2 flex space-x-2">
              <input
                value={accessory2}
                onChange={(e) => setAccessorys(e.target.value, 2)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your prompt here"
              />
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Clothes
            </label>
            <div className="mt-2 flex space-x-2">
              <input
                value={accessory3}
                onChange={(e) => setAccessorys(e.target.value, 3)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your prompt here"
              />
            </div>
          </div>
        </div>
      </div> */}
      {/* Select Prompt */}
      {/* <div className="w-full mx-auto px-20 flex">
        <div className="w-1/2 p-2">
          <Dropdown>
            <Dropdown.Button flat>Body</Dropdown.Button>
            <Dropdown.Menu aria-label="Static Actions">
              <Dropdown.Item key="new">Whole Body</Dropdown.Item>
              <Dropdown.Item key="copy">Copy link</Dropdown.Item>
              <Dropdown.Item key="edit">Edit file</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="w-1/2 p-2">
          <Dropdown>
            <Dropdown.Button flat>Trigger</Dropdown.Button>
            <Dropdown.Menu aria-label="Static Actions">
              <Dropdown.Item key="new">New file</Dropdown.Item>
              <Dropdown.Item key="copy">Copy link</Dropdown.Item>
              <Dropdown.Item key="edit">Edit file</Dropdown.Item>
              <Dropdown.Item key="delete" color="error">
                Delete file
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="w-1/2 p-2">
          <Dropdown>
            <Dropdown.Button flat>Trigger</Dropdown.Button>
            <Dropdown.Menu aria-label="Static Actions">
              <Dropdown.Item key="new">New file</Dropdown.Item>
              <Dropdown.Item key="copy">Copy link</Dropdown.Item>
              <Dropdown.Item key="edit">Edit file</Dropdown.Item>
              <Dropdown.Item key="delete" color="error">
                Delete file
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div> */}
      {/* Log */}
      {/* <div className="w-full mx-auto px-20 flex">
        <pre>Response Message: {response}</pre>
        Error: {error}
      </div> */}
      {/* Images */}
      {/* <div>
        <h1 className="text-4xl py-8">These are your images!</h1>
        <div className="grid grid-cols-3 gap-4">
          {imgs.map((img) => (
            <div className="w-full" key={img.imgUrl}>
              <img
                src={img.imgUrl}
                key={img.imgUrl}
                alt="nothing"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}