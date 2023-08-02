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
      }
    })()
  }, [])

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