"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSupabase } from "@/app/supabase-provider";
import { useAuth } from "@/app/auth-provider"
import Toggle from '@/components/ui/Toggle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperProps } from "swiper";
import { redirect } from 'next/navigation';
import Pusher from 'pusher-js';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

import { Database } from '@/types_db';
import { PUSHER_CHANNEL, PUSHER_CLUSTER, PUSHER_KEY, SUPABASE_URL } from "@/config/constant";
import { NextlegResponse } from "@/config/type"
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './styles.css';

interface Image {
  preview: string;
  raw: File;
}

const promptList = [
  "an animated hero in a bright outfit, in the style of furaffinity, cosmic, manga-inspired, dark azure and gold, [tyler edlin], superheroes, [shuzo oshimi]",
  "a ue5 3D character wearing a cape with an image of a city behind it, in the style of furaffinity, light gold and dark azure, handsome, uniformly staged images, glowing colors, shiny eyes, oshare kei",
  "one of the character from the animated series of dc comics person, dc superhero, hero, fireman, in the style of shige's visual aesthetic style, light gold and black, celestialpunk, vibrant, lively, shiny eyes, supernatural realism, toonami",
  "colored superhero standing on a city street, in the style of dark magenta and light gold, vibrant manga, cabincore, neo-academism, youthful energy, energy-filled illustrations, rtx",
  "the character from 'mr marvel', in the style of sailor moon manga style, toonami, celestialpunk, dark purple and light gold, handsome, uniformly staged images, neo-academism",
  "a cartoon hero holding a giant star and superhero hat, in the style of vibrant manga, dark azure and gold, futuristic designs, the vancouver school, contest winner, vibrant, neon colors, rtx",
];

const characterList = ["SuperHero1", "SuperHero2", "SuperHero3", "SuperHero4", "SuperHero5", "SuperHero6"];

const colorList = ["Red", "Blue", "Purple", "Black", "White",];

export default function Generate() {
  const { session, userId, generateCount, setGenerateCount } = useAuth();

  if (!session) {
    return redirect('/signin');
  }

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false)
  const [msgId, setMsgId] = useState("");
  const currentMsgId = useMemo(() => msgId, [msgId])
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeInx, setActiveInx] = useState(0)
  const [image, setImage] = useState<Image | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperProps | null>(null);
  const [generatedAvatar, setGeneratedAvatar] = useState<NextlegResponse | null>(null);
  const { avatarGenerating, toggleAvatarGenerating } = useSupabase();

  const [prompt1, setPrompt1] = useState("0");
  const [prompt2, setPrompt2] = useState("0");
  const [prompt3, setPrompt3] = useState("0");

  const supabase = createClientComponentClient<Database>()

  const pusher = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER
  });
  const channel = pusher.subscribe(PUSHER_CHANNEL)

  const handleData = (data: any) => {
    console.log(JSON.stringify(data, null, 2), `msgId:${currentMsgId},`, data.originatingMessageId === currentMsgId);

    setGeneratedAvatar(data);
    setLoading(false)
  }
  channel.bind("currentMsgId", handleData);

  useEffect(() => {
    if (currentMsgId) {
      channel.unbind_all()
      channel.bind(currentMsgId, handleData);
    }

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [currentMsgId]);

  const handleChange = async (e: any) => {
    if (e.target.files.length) {
      const uploadFile = e.target.files[0]
      setImage({
        preview: URL.createObjectURL(uploadFile),
        raw: uploadFile
      });
      try {
        toggleAvatarGenerating();

        const filename = `${uuidv4()}-${uploadFile.name}`;
        const { data, error } = await supabase.storage
          .from("ai-gallery")
          .upload(filename, uploadFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error
        }

        if (data) {
          const imageLink = `${SUPABASE_URL}/storage/v1/object/public/ai-gallery/${data.path}`;
          setImageUrl(imageLink);
        }
      } catch (error) {
        console.error(error);
      } finally {
        toggleAvatarGenerating();
      }
    }
  };

  const handleSubmit = async () => {
    if (generateCount > 0) {
      try {
        setLoading(true);
        setThumbsSwiper(null)
        const { data: { messageId: originMsgId } } = await axios.post(
          "/api/generate-avatar",
          {
            userId,
            cmd: "imagine",
            imageUrl,
            prompt,
            generateCount,
          }
        )
        setMsgId(originMsgId);
        console.log(originMsgId)
        setGenerateCount(generateCount - 1)
      } catch (e: any) {
        console.log("error", e.message);
      }
    }
  }

  const handleSubmitWithSelects = async () => {
    if (generateCount > 0) {
      try {
        setLoading(true);
        setThumbsSwiper(null)
        const { data: { messageId: originMsgId } } = await axios.post(
          "/api/generate-avatar",
          {
            userId,
            cmd: "imagine",
            imageUrl,
            prompt: (prompt2 === "0" ? "male" : "female") + " " + colorList[parseInt(prompt3)] + " color of " + promptList[parseInt(prompt1)],
            generateCount,
          }
        )
        setMsgId(originMsgId);
        console.log(originMsgId)
        setGenerateCount(generateCount - 1)
      } catch (e: any) {
        console.log("error", e.message);
      }
    }
  }

  const saveGeneratedAvatar = async () => {
    try {
      setSaveLoading(true)
      if (userId && generatedAvatar && thumbsSwiper) {
        await supabase.from("gallery").update({
          one_image: generatedAvatar.imageUrl,
          param: '',
          selected: generatedAvatar.imageUrls[activeInx],
          is_public: isPublic,
        }).eq("origin_message", currentMsgId).eq("user_id", userId)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center ">
      {!avatarGenerating ?
        <>
          <div className="flex flex-col	justify-between	col-span-full mt-2 w-[300px]">
            <label htmlFor="upload-button">
              {image && image.preview ? (
                <img src={image.preview} alt="dummy" width="300" height="300" />
              ) : (
                <>
                  <span className="fa-stack fa-2x mt-3 mb-2">
                    <i className="fas fa-circle fa-stack-2x" />
                    <i className="fas fa-store fa-stack-1x fa-inverse" />
                  </span>
                  <h5 className="text-center">Upload your photo</h5>
                </>
              )}
            </label>
            <input
              type="file"
              id="upload-button"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChange}
            />
          </div>
          {/* Text Prompt */}
          <div className="w-full mx-auto px-20">
            <label className="relative inline-flex items-center cursor-pointer pr-2">
              <input type="checkbox" value="" className="sr-only peer" onChange={(e) => setVisible(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
            Switch prompt type
          </div>
          {visible ?
            (<div className="w-full mx-auto px-20">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Prompt
                </label>
                <div className="mt-2 flex space-x-2">
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter your prompt here"
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSubmit}
                    disabled={loading || avatarGenerating || (!prompt)}
                  >
                    {avatarGenerating ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>)
            : (
              <div className="w-full mx-auto px-20">
                <div className="w-full mx-auto flex font-white">
                  <div className="w-1/3">
                    {characterList.map((label, index) => (
                      <div className="flex items-center mt-2" key={index}>
                        <input
                          checked={prompt1 === `${index}`}
                          onChange={(e) => setPrompt1(e.target.value)}
                          id={`option-${index}`}
                          type="checkbox"
                          value={index}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor={`option-${index}`} className="ml-2 text-sm font-medium">{label}</label>
                      </div>
                    ))}
                  </div>
                  <div className="w-1/3">
                    <div className="flex items-center mt-2">
                      <input checked={prompt2 === "0" ? true : false} onChange={(e) => setPrompt2(e.target.value)} id="default-checkbox" type="checkbox" value="0" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium">Male</label>
                    </div>
                    <div className="flex items-center mt-2">
                      <input checked={prompt2 === "1" ? true : false} onChange={(e) => setPrompt2(e.target.value)} id="checked-checkbox" type="checkbox" value="1" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checked-checkbox" className="ml-2 text-sm font-medium">Female</label>
                    </div>
                  </div>
                  <div className="w-1/3">
                    {colorList.map((label, index) => (
                      <div className="flex items-center mt-2" key={index}>
                        <input
                          checked={prompt3 === `${index}`}
                          onChange={(e) => setPrompt3(e.target.value)}
                          id={`option-${index}`}
                          type="radio"
                          value={index}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor={`option-${index}`} className="ml-2 text-sm font-medium">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSubmitWithSelects}
                  disabled={loading || avatarGenerating}
                >
                  {avatarGenerating ? "Submitting..." : "Submit"}
                </button>
              </div>
            )}
        </>
        : (<div className="fixed left-0 top-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden outline-none absolute w-full h-full top-0 bg-[#00000099] z-50">
          <div className="flex items-center justify-center min-h-screen">
            <img
              src="/loader.gif"
              alt="loading"
              className="h-48 flex items-center justify-center"
            />
          </div>
        </div>)}

      {
        !loading ?
          generatedAvatar?.imageUrls.length && generatedAvatar?.originatingMessageId && generatedAvatar?.content &&
          (<>
            <h1 className="text-4xl py-8">These are your images!</h1>
            <div className="">
              <Swiper
                loop={true}
                onRealIndexChange={(e) => setActiveInx(e.realIndex)}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2"
              >
                {generatedAvatar?.imageUrls.map((url, inx) => (<SwiperSlide key={inx}>
                  <img src={`${url}`} />
                </SwiperSlide>))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
              >
                {generatedAvatar?.imageUrls.map((url, inx) => (<SwiperSlide key={inx}>
                  <img src={`${url}`} />
                </SwiperSlide>))}
              </Swiper>
            </div>
            <div className="float-right">
              <div className="flex justify-between w-80 pb-2">
                <Toggle
                  labels={['Public', 'Private']}
                  onChange={setIsPublic}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={saveLoading}
                  onClick={saveGeneratedAvatar}
                >
                  {saveLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </>)
          : (<div className="fixed left-0 top-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden outline-none absolute w-full h-full top-0 bg-[#00000099] z-50">
            <div className="flex items-center justify-center min-h-screen">
              <img
                src="/loader.gif"
                alt="loading"
                className="h-48 flex items-center justify-center"
              />
            </div>
          </div>)}
    </div>
  );
}