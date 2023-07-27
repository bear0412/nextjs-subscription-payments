"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThreeDots } from "react-loader-spinner";
import { useSupabase } from "@/app/supabase-provider";
import { useAuth } from "@/app/auth-provider"
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperProps } from "swiper";
import { redirect } from 'next/navigation';
import Pusher from 'pusher-js';

import { Database } from '@/types_db';
import { SUPABASE_URL } from "@/config/constant";
import { NextlegResponse } from "@/config/type"
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

interface Image {
  preview: string;
  raw: File;
}

export default function Generate() {
  const { session, userId, generateCount, setGenerateCount } = useAuth();

  if (!session) {
    return redirect('/signin');
  }

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgId, setMsgId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState<Image | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperProps | undefined>();
  const [generatedAvatar, setGeneratedAvatar] = useState<NextlegResponse | null>(null);
  const { avatarGenerating, toggleAvatarGenerating } = useSupabase();

  const supabase = createClientComponentClient<Database>()

  // Pusher.logToConsole = true;

  const pusher = new Pusher('18e7661daefa46639f78', {
    cluster: 'eu'
  });

  const channel = pusher.subscribe('eden-ai');
  channel.bind('generatedAvatar', (data: NextlegResponse) => {
    console.log(JSON.stringify(data, null, 2));
    if (data.originatingMessageId === msgId) {
      alert("done!");
      console.log(JSON.stringify(data, null, 2));
      setGeneratedAvatar(data);
      setLoading(false)
    }
  });

  const handleChange = async (e: any) => {
    if (e.target.files.length) {
      const uploadFile = e.target.files[0]
      setImage({
        preview: URL.createObjectURL(uploadFile),
        raw: uploadFile
      });
      try {
        toggleAvatarGenerating();
        setLoading(true)

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
          const { error } = await supabase.from("gallery").insert({
            image_link: imageLink,
            user_id: userId
          })
          if (error) {
            throw error
          }
        }
      } catch (error) {
        alert('Error loading user data!')
        console.log(error);
      } finally {
        setLoading(false)
        toggleAvatarGenerating();
      }
    }
  };

  const handleSubmit = async () => {
    if (generateCount > 0) {
      try {
        setLoading(true);
        const { data: { messageId: originMsgId } } = await axios.post(
          "/api/generate-avatar",
          {
            userId,
            cmd: "imagine",
            imageUrl,
            prompt,
            generateCount
          }
        )
        setGenerateCount(generateCount - 1)
        console.log(originMsgId)
        setMsgId(originMsgId);
      } catch (e: any) {
        console.log("error", e.message);
      } finally {
        // setLoading(false);
      }
    }
  }

  const saveGeneratedAvatar = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && generatedAvatar && thumbsSwiper) {
      const { error } = await supabase.from("gallery").update({
        message_link: generatedAvatar.originatingMessageId,
        param: '',
        selected: generatedAvatar.imageUrls[thumbsSwiper.activeIndex],
        is_public: isPublic,
      }).eq("image_link", imageUrl).eq("user_id", user.id)
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
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </>
        : <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          visible={true}
        />}
      <>{console.log(generatedAvatar)}</>
      {generatedAvatar?.imageUrls.length && generatedAvatar?.originatingMessageId && generatedAvatar?.content && (
        <>
          <h1 className="text-4xl py-8">These are your images!</h1>
          <div className="">
            <Swiper
              loop={true}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2"
            >
              {generatedAvatar?.imageUrls.map((url, inx) => (<SwiperSlide>
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
              {generatedAvatar?.imageUrls.map((url, inx) => (<SwiperSlide>
                <img src={`${url}`} />
              </SwiperSlide>))}
            </Swiper>
          </div>
          <div className="float-right">
            <div className="flex justify-between w-80">
              <Toggle
                labels={['Private', 'Public']}
                onChange={setIsPublic}
              />
              <Button
                variant="slim"
                // disabled={avatarGenerating}
                onClick={saveGeneratedAvatar}
              >
                Save
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}