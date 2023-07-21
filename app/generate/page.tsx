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

import { Database } from '@/types_db';
import { NEXTLOG_TOKEN, NEXTLOG_URL, SUPABASE_URL } from "@/config/constant";
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
  const [submitLoading, setSubmitLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [image, setImage] = useState<Image | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperProps | undefined>();
  const { avatarGenerating, toggleAvatarGenerating, generatedAvatar } = useSupabase();

  const supabase = createClientComponentClient<Database>()

  const handleChange = (e: any) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
      console.log(URL.createObjectURL(e.target.files[0]))
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (image && !!image.raw && !!image.preview) {
      try {
        toggleAvatarGenerating();
        setLoading(true)

        const filename = `${uuidv4()}-${image.raw.name}`;

        const { data, error } = await supabase.storage
          .from("ai-gallery")
          .upload(filename, image.raw, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error
        }

        if (data) {
          const image_link = `${SUPABASE_URL}/storage/v1/object/ai-gallery/${data.path}`;
          setImageUrl(image_link);
          const { error } = await supabase.from("gallery").insert({
            image_link: image_link,
            prompt: prompt,
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
    } else {
      alert("Select Image first")
    }
  };

  const handleSubmit = async () => {
    if (generateCount > 0) {
      try {
        setSubmitLoading(true);
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NEXTLOG_TOKEN}`,
        };
        const { data: res } = await axios.post(
          `${NEXTLOG_URL}`,
          {
            cmd: "imagine",
            msg: `${imageUrl} ${prompt}`,
          },
          { headers }
        );

        await supabase.from('users').update({ generate_count: generateCount - 1 }).eq('id', userId)
        setGenerateCount(generateCount - 1)
        console.log("success", JSON.stringify(res, null, 2), generateCount - 1);
      } catch (e: any) {
        console.log("error", e.message);
      } finally {
        setSubmitLoading(false);
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
            {/* <form onSubmit={handleUpload}>
              <input type="file" name="image" onChange={handleFileSelected} />
              <button type="submit">Upload image</button>
            </form>
            {!imageUrl && (
              <button
                onClick={handleSubmit}
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
            )} */}
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
            <br />
            <button
              onClick={handleUpload}
              className="flex justify-center rounded-lg border border-dashed border-gray-900/25 w-full py-1 px-auto  bg-gray-400"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
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
                >
                  {submitLoading ? "Submitting..." : "Submit"}
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