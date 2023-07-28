"use client";
import React/* , { useEffect, useState } */ from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import ImageModal from "./ImageModal"
import { useSupabase } from "@/app/supabase-provider"
import { Database } from '@/types_db'
import { useAuth } from "@/app/auth-provider";
import { redirect } from "next/navigation";
type Gallery = Database['public']['Tables']['gallery']['Row'];

export default async function Gallery() {
  const { session, userId } = useAuth();

  if (!session) {
    return redirect('/signin')
  }

  // const { userSubscription } = useSupabase();
  // const [avatars, setAvatars] = useState<Gallery[]>([]);
  const supabase = createClientComponentClient<Database>()
  let avatars: any[] = [];

  // const { data, error } = await supabase.rpc('get_active_subscription_unit_amount', { user_id: userId });

  // if (error) {
  //   console.error('Error fetching active subscription unit amount:', error);
  //   return null;
  // }

  // if (data && data.length > 0) {
  //   const { unit_amount } = data[0];
  //   setUserSubscription(unit_amount);
  // }

  let userSubscription = 3999

  // useEffect(() => {
  //   (async () => {
  switch (userSubscription) {
    case 999:
    case 9999:
    case 1999:
    case 19999:
      const { data: freeAvatars, error: freeError } = await supabase.from("gallery").select("*").eq("user_id", userId).neq('selected', '')
      console.log(freeAvatars, freeError)
      if (freeError) {
        console.log(freeError)
        break;
      }
      avatars = freeAvatars
      break;

    case 3999:
    case 39999:
      const { data: expertAvatars, error: expertError } = await supabase.from("gallery").select("*")/* .eq("user_id", userId).is('is_public', true) */.neq('selected', '')
      if (expertError) {
        console.log(expertError)
        break;
      }
      avatars = expertAvatars
      break;

    // case 7999:
    // case 79999:
    //   const { data: superAvatars, error: superError } = await supabase.from("gallery").select("*").neq('selected', '')
    //   if (superError) {
    //     console.log(superError)
    //     break;
    //   }
    //   setAvatars(superAvatars)
    //   break;

    default:
      break;
  }
  //   })()
  // }, [])


  return (
    <>
      {
        (avatars && avatars.length) ?
          <div className="container grid grid-cols-3 gap-2 mx-auto">
            {avatars.map((item, inx) =>
              <ImageModal
                key={inx}
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