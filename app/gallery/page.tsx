"use client";
import React, { useEffect, useState, useLayoutEffect } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import Paginate from './Paginate';
import ImageModal from "./ImageModal"
import { Database } from '@/types_db'
import { useAuth } from "@/app/auth-provider";
import { redirect } from "next/navigation";
type Gallery = Database['public']['Tables']['gallery']['Row'];

export default function Gallery() {
  const { session, userId } = useAuth();
  const [loading, setLoading] = useState(true)
  // const [blogPosts, setBlogPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [avatarsPerPage, setAvatarsPerPage] = useState(0)

  if (!session) {
    return redirect('/signin')
  }

  const supabase = createClientComponentClient<Database>()
  const [avatars, setAvatars] = useState<Gallery[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('price_id, prices(unit_amount)')
        .eq('status', 'active')

      if (error) {
        console.error('Error fetching active subscription unit amount:', error);
        return null;
      }

      if (data && data.length > 0) {
        const { prices: unit_amount } = data[0];

        switch (unit_amount?.unit_amount) {
          case 999:
          case 9999:
          case 1999:
          case 19999:
            const { data: freeAvatars, error: freeError } = await supabase
              .from("gallery")
              .select("*")
              .eq("user_id", userId)
              .neq('selected', '')
              .order('created_at', { ascending: true })
            if (freeError) {
              console.log(freeError)
              break;
            }
            setAvatars(freeAvatars)
            break;

          case 3999:
          case 39999:
            const { data: expertAvatars, error: expertError } = await supabase
              .from("gallery")
              .select("*")
              .neq('selected', '')
              .order('created_at', { ascending: true })
            if (expertError) {
              console.log(expertError)
              break;
            }
            setAvatars(expertAvatars)
            break;

          default:
            break;
        }

        setLoading(false)
      }
    })()
  }, [])

  useLayoutEffect(() => {
    function updateSize() {
      const currentWidth = window.innerWidth
      console.log(currentWidth)
      if (currentWidth < 640)
        setAvatarsPerPage(1 * 3)
      if (currentWidth < 1024)
        setAvatarsPerPage(2 * 3)
      else if (currentWidth < 1280)
        setAvatarsPerPage(3 * 3)
      else
        setAvatarsPerPage(4 * 3)
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const indexOfLastPost = currentPage * avatarsPerPage;
  const indexOfFirstPost = indexOfLastPost - avatarsPerPage;
  // const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== Math.ceil(avatars.length / avatarsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="max-w-6xl px-2 lg:max-w-4xl md:max-w-2xl sm:max-w-xl mx-auto">
        {
          loading ?
            (<div className="fixed left-0 top-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden outline-none absolute w-full h-full top-0 bg-[#00000099] z-50">
              <div className="flex items-center justify-center min-h-screen">
                <img
                  src="/loader.gif"
                  alt="loading"
                  className="h-48 flex items-center justify-center"
                />
              </div>
            </div>)
            : (avatars && avatars.length) ?
              <div>
                <Paginate
                  postsPerPage={avatarsPerPage}
                  totalPosts={avatars.length}
                  currentPage={currentPage}
                  paginate={paginate}
                  previousPage={previousPage}
                  nextPage={nextPage}
                />
                <div className="container grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-2 mx-auto">
                  {avatars.slice(avatarsPerPage * (currentPage - 1), avatarsPerPage * currentPage).map((item, inx) =>
                    <ImageModal
                      key={inx}
                      src={`${item.selected}`}
                      created={`${item.created_at}`}
                      prompt={`${item.prompt}`}
                    />
                  )}
                </div>
              </div>
              : <div className="flex items-center justify-center h-screen">
                <h1 className="font-semibold text-6xl underline decoration-3">There is no avatars...</h1>
              </div>
        }
      </div>
    </>
  );
}