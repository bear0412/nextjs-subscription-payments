"use client";
import React, { useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import ImageModal from "./ImageModal"
import { Database } from '@/types_db'
import { useAuth } from "@/app/auth-provider";
import { redirect } from "next/navigation";
type Gallery = Database['public']['Tables']['gallery']['Row'];

export default function Gallery() {
  const { session, userId } = useAuth();

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
            const { data: freeAvatars, error: freeError } = await supabase.from("gallery").select("*").eq("user_id", userId).neq('selected', '')
            console.log(freeAvatars, freeError)
            if (freeError) {
              console.log(freeError)
              break;
            }
            setAvatars(freeAvatars)
            break;

          case 3999:
          case 39999:
            const { data: expertAvatars, error: expertError } = await supabase.from("gallery").select("*")/* .eq("user_id", userId).is('is_public', true) */.neq('selected', '')
            if (expertError) {
              console.log(expertError)
              break;
            }
            setAvatars(expertAvatars)
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
      }
    })()
  }, [])

  {/* <div class="relative flex flex-row justify-between py-4 align-center md:py-6"><div class="flex items-center flex-1"><a class="Navbar_logo__INhgK" aria-label="Logo" href="/"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class=""><rect width="100%" height="100%" rx="16" fill="white"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z" fill="black"></path></svg></a><nav class="hidden ml-6 space-x-2 lg:block"><a class="Navbar_link__teYe1" href="/pricing">Pricing</a><a class="Navbar_link__teYe1" href="/account">Account</a><a class="Navbar_link__teYe1" href="/generate">Generate</a><a class="Navbar_link__teYe1" href="/gallery">Gallery</a></nav></div><div class="flex justify-end flex-1 space-x-8"><button class="Navbar_link__teYe1">Sign out</button></div></div> */ }
  return (
    <>
      <div className="max-w-6xl px-2 lg:max-w-4xl md:max-w-2xl sm:max-w-xl mx-auto">
        {
          (avatars && avatars.length) ?
            <div className="container grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-2 mx-auto">
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
      </div>
    </>
  );
}