"use client";
import React, { useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import ImageModal from "./ImageModal"
import { useSupabase } from "@/app/supabase-provider"
import { Database } from '@/types_db'
import { useAuth } from "@/app/auth-provider";
import { redirect } from "next/navigation";
type Gallery = Database['public']['Tables']['gallery']['Row'];

export default function Gallery() {
  const { session, userId } = useAuth();

  if (!session) {
    return redirect('/signin')
  }
  console.log(
    "in gallery",
    session
  )

  const { userSubscription } = useSupabase();
  const [avatars, setAvatars] = useState<Gallery[]>([]);
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    (async () => {
      switch (userSubscription) {
        case 999:
        case 9999:
        case 1999:
        case 19999:
          const { data: freeAvatars, error: freeError } = await supabase.from("gallery").select("*").eq("user_id", "userId").neq('selected', '')
          if (freeError) {
            console.log(freeError)
            break;
          }
          setAvatars(freeAvatars)
          break;

        case 3999:
        case 39999:
          const { data: expertAvatars, error: expertError } = await supabase.from("gallery").select("*").eq("user_id", "userId").is('is_public', true).neq('selected', '')
          if (expertError) {
            console.log(expertError)
            break;
          }
          setAvatars(expertAvatars)
          break;

        case 7999:
        case 79999:
          const { data: superAvatars, error: superError } = await supabase.from("gallery").select("*").neq('selected', '')
          if (superError) {
            console.log(superError)
            break;
          }
          setAvatars(superAvatars)
          break;

        default:
          break;
      }
    })()
  }, [])


  return (
    <>
      {
        (avatars && avatars.length) ?
          <div className="container grid grid-cols-3 gap-2 mx-auto">
            {avatars.map((item, inx) =>
              <ImageModal
                src={`${item.selected}`}
                created={`${item.created_at}`}
                prompt={`${item.prompt}`}
              />
            )}
          </div>
          : <div className="flex items-center justify-center h-screen">
            <h1 className="font-semibold text-6xl underline decoration-3">There is no avatars...</h1>
          </div>
      }
      <>{console.log(avatars)}</>
    </>
  );
}