'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSupabase } from '@/app/supabase-provider';
import { useAuth } from '@/app/auth-provider';
import Toggle from '@/components/ui/Toggle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperProps } from 'swiper';
import { redirect } from 'next/navigation';
import Pusher from 'pusher-js';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

import { Database } from '@/types_db';
import {
  PUSHER_CHANNEL,
  PUSHER_CLUSTER,
  PUSHER_EVENT,
  PUSHER_KEY,
  SUPABASE_URL
} from '@/config/constant';

import Option from '@/components/eden/Option';
import { NextlegResponse } from '@/config/type';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './styles.css';
import Button from '@/components/eden/Button';
import Divider from '@/components/eden/Divider';
import Resolution from '@/components/eden/Resolution';
import Select from '@/components/eden/Select';
import Accordion from '@/components/eden/Accordion';
import Switch from '@/components/eden/Switch';
import Card from '@/components/eden/Card';
import ScreenSpinner from '@/components/eden/ScreenSpinner';

interface Image {
  preview: string;
  raw: File;
}

export default function Generate() {
  const { session, userId, generateCount, setGenerateCount } = useAuth();

  if (!session) {
    return redirect('/signin');
  }

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgId, setMsgId] = useState('');
  const currentMsgId = useMemo(() => msgId, [msgId]);
  const [imageUrl, setImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState<Image | null>(null);
  const [generatedAvatar, setGeneratedAvatar] =
    useState<NextlegResponse | null>(null);
  const { avatarGenerating, toggleAvatarGenerating } = useSupabase();

  const supabase = createClientComponentClient<Database>();

  const pusher = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER
  });
  const channel = pusher.subscribe(PUSHER_CHANNEL);

  const handleData = (data: any) => {
    console.log(
      JSON.stringify(data, null, 2),
      `msgId:${currentMsgId},`,
      data.originatingMessageId === currentMsgId
    );

    setGeneratedAvatar(data);
    setLoading(false);
  };
  channel.bind('currentMsgId', handleData);

  useEffect(() => {
    if (currentMsgId) {
      channel.unbind_all();
      channel.bind(currentMsgId, handleData);
    }
    // Returning a cleanup function that will be called when the component unmounts or before the effect runs again
    // Here, it is used to unsubscribe from the channel
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [currentMsgId]);

  const handleChange = async (e: any) => {
    if (e.target.files.length) {
      const uploadFile = e.target.files[0];
      setImage({
        preview: URL.createObjectURL(uploadFile),
        raw: uploadFile
      });
      try {
        toggleAvatarGenerating();

        const filename = `${uuidv4()}-${uploadFile.name}`;
        const { data, error } = await supabase.storage
          .from('ai-gallery')
          .upload(filename, uploadFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          throw error;
        }

        if (data) {
          const imageLink = `${SUPABASE_URL}/storage/v1/object/public/ai-gallery/${data.path}`;
          setImageUrl(imageLink);
        }
      } catch (error) {
        alert('Error loading user data!');
        console.log(error);
      } finally {
        toggleAvatarGenerating();
      }
    }
  };

  const handleSubmit = async () => {
    if (generateCount > 0) {
      try {
        setLoading(true);
        const {
          data: { messageId: originMsgId }
        } = await axios.post('/api/generate-avatar', {
          userId,
          cmd: 'imagine',
          imageUrl,
          prompt,
          generateCount
        });
        console.log(msgId, originMsgId);
        setMsgId(originMsgId);
        setGenerateCount(generateCount - 1);
      } catch (e: any) {
        console.log('error', e.message);
      } finally {
        // setLoading(false);
      }
    }
  };

  const onButtonClick = async (btn: string, buttonMessageId: string) => {
    if (generateCount > 0) {
      try {
        setLoading(true);
        console.log(msgId);
        const {
          data: { messageId: originMsgId }
        } = await axios.post('/api/button', {
          userId,
          button: btn,
          buttonMessageId: buttonMessageId,
          generateCount
        });
        console.log(msgId, originMsgId);
        setMsgId(originMsgId);
        setGenerateCount(generateCount - 1);
      } catch (e: any) {
        console.log('error', e.message);
      } finally {
        // setLoading(false);
      }
    }
  };

  const onSaveToGallery = async (index: number) => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user && generatedAvatar) {
        const { error } = await supabase
          .from('gallery')
          .update({
            one_image: generatedAvatar.imageUrl,
            param: '',
            selected: generatedAvatar.imageUrls[index],
            is_public: isPublic
          })
          .eq('origin_message', msgId)
          .eq('user_id', userId);
        if (error) console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    //   <div className="backdrop-blur-sm bg-white/30 w-full h-full">
    //   background
    // </div>
    <div className="flex w-[calc(100dvw-10px)] min-h-[100dvh]">
      <div className="w-[272px] bg-gradient-to-b from-[#000000] to-[#00000075] pt-[20px] px-[20px]">
        <div className="h-[44px] flex">
          <img src="/logo.png" width={'44px'} height={'44px'}></img>
          <span className="text-[18px] font-medium my-auto mx-2 leading-[27px] tracking-[0.32px] align-middle	">
            EDEN.
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#44D4A4] to-[#CEFFEE] font-bold">
              Ai
            </span>
          </span>
          <span className="my-auto text-[10px] font-light	leading-3 tracking-[0.32px]">
            Version 0.0.1
          </span>
        </div>
        <div className="w-1/1 mt-3">
          <div className="h-1/1 w-1/1 version flex py-3 pl-[29px] pr-[16px] items-center rounded-[10px] space-x-4 whitespace-nowrap">
            <span className="text-sm leading-[21px] font-semibold">
              FREE Version
            </span>
            <Button className="account-button">My Account</Button>
          </div>
        </div>
        <div className="text-[10px] mt-2">
          <Option
            data={['Human', 'Fantasy', 'Anime']}
            onChange={(e) => {
              console.log(e);
            }}
          ></Option>
          <Option
            data={['Male', 'Female', 'No Gender']}
            onChange={(e) => {
              console.log(e);
            }}
          ></Option>
          <Option
            data={['Young', 'Mid', 'Old']}
            onChange={(e) => {
              console.log(e);
            }}
          ></Option>
          <Option
            data={['Happy', 'Angry']}
            onChange={(e) => {
              console.log(e);
            }}
          ></Option>
          <Option
            data={['Tiny', 'Tall']}
            onChange={(e) => {
              console.log(e);
            }}
          ></Option>
        </div>
        <div className="mt-4">
          <Accordion>
            <div className="flex space-2">
              <span className="text-[15px] font-semibold">IMAGE</span>
              <span className="my-auto ml-2 text-[#777777]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 22 22"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </span>
            </div>
            <div>
              {/* <Accordion labels={[]} onChange={(e) => console.log(e)}></Accordion> */}
            </div>
            <div className="mt-4 flex justify-between">
              <Button className="w-[92px] upload-button">UPLOAD</Button>
              <div className="flex text-xs">
                <div className="mt-1 mb-[0.125rem] inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-0 before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] ring-shadow"
                    type="checkbox"
                    id="inlineCheckbox1"
                    value="option1"
                  />
                  <label
                    className="inline-block hover:cursor-pointer mt-[2px]"
                    htmlFor="inlineCheckbox1"
                  >
                    Transparent BG
                  </label>
                </div>
              </div>
            </div>
          </Accordion>
        </div>
        <div className="mt-4">
          <Divider />
          <Accordion>
            <div className="flex space-2">
              <span className="text-[15px] font-semibold">
                Input Dimensions
              </span>
              <span className="my-auto ml-2 text-[#777777]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 22 22"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <Resolution
                data={[
                  '512 x 768',
                  '1024 x 768',
                  '1024 x 768',
                  '1024 x 768',
                  '1024 x 768',
                  '768 x 1024'
                ]}
                onChange={(e) => console.log(e)}
              />
            </div>
            {/* The place where for the resolution selector */}
            <div className="mt-2 mb-3">
              <Select
                data={['1:1', '2:1', '3:1']}
                onChange={(e) => {
                  console.log(e);
                }}
              />
            </div>
          </Accordion>
          <Divider />
        </div>
      </div>
      <div className="w-[calc(100%-272px)] min-h-[100dvh] bg-[#D9D9D9] p-6">
        <div className="flex justify-between h-16">
          <div className="">Menu</div>
          <div className="">
            <Switch
              data={['super hero', 'second', 'third']}
              onChange={(e) => console.log(e)}
            />
          </div>
        </div>

        <div className="flex w-full my-[22px]">
          <Card
            imageLinks={generatedAvatar ? generatedAvatar.imageUrls : []}
            buttons={generatedAvatar ? generatedAvatar.buttons : []}
            buttonMessageId={
              generatedAvatar ? generatedAvatar.buttonMessageId : ''
            }
            // onChange={(num) => setActiveInx(num)}
            onButtonClick={onButtonClick}
            onSaveToGallery={onSaveToGallery}
          />
        </div>
        <div className="mt-4">
          <div className="text-[#0B0F17] text-[20px] font-bold leading-[22px]">
            DETAILS: Describe me what your “Superhero” is doing.
          </div>
          <div className="flex mt-4">
            <textarea
              className="w-full ring-0 py-4 px-5 bg-[#0B0F17] border-[1px] border-black rounded-lg"
              placeholder="Type a prompt ..."
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              className="ml-4"
              onClick={handleSubmit}
              loading={loading || avatarGenerating}
              disabled={!prompt}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <>
        {/* {!avatarGenerating ? (
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
              style={{ display: 'none' }}
              onChange={handleChange}
            />
          </div>

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
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your prompt here"
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSubmit}
                  disabled={loading || avatarGenerating || !prompt}
                >
                  {avatarGenerating ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="fixed left-0 top-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden outline-none absolute w-full h-full top-0 bg-[#00000099] z-50">
          <div className="flex items-center justify-center min-h-screen">
            <img
              src="/loader.gif"
              alt="loading"
              className="h-48 flex items-center justify-center"
            />
          </div>
        </div>
      )}

      {!loading ? (
        generatedAvatar?.imageUrls.length &&
        generatedAvatar?.originatingMessageId &&
        generatedAvatar?.content && (
          <>
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
                {generatedAvatar?.imageUrls.map((url, inx) => (
                  <SwiperSlide key={inx}>
                    <img src={`${url}`} />
                  </SwiperSlide>
                ))}
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
                {generatedAvatar?.imageUrls.map((url, inx) => (
                  <SwiperSlide key={inx}>
                    <img src={`${url}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="float-right">
              <div className="flex justify-between w-80 pb-2">
                <Toggle labels={['Public', 'Private']} onChange={setIsPublic} />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={saveLoading}
                  onClick={saveGeneratedAvatar}
                >
                  {saveLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="fixed left-0 top-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden outline-none absolute w-full h-full top-0 bg-[#00000099] z-50">
          <div className="flex items-center justify-center min-h-screen">
            <img
              src="/loader.gif"
              alt="loading"
              className="h-48 flex items-center justify-center"
            />
          </div>
        </div>
      )} */}
      </>
      <ScreenSpinner loading={false} />
    </div>
  );
}
