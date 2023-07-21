'use client';

import type { Database } from '@/types_db';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { useToggle } from 'usehooks-ts';
import { SetValue, NextlegResponse } from "@/config/type"

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
  avatarGenerating: boolean;
  toggleAvatarGenerating: () => void;
  generatedAvatar: NextlegResponse | null;
  setGeneratedAvatar: SetValue<NextlegResponse | null>;
  userSubscription: number;
  setUserSubscription: SetValue<number>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createPagesBrowserClient());
  const [avatarGenerating, toggleAvatarGenerating] = useToggle()
  const [generatedAvatar, setGeneratedAvatar] = useState<NextlegResponse | null>(null);
  const [userSubscription, setUserSubscription] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Context.Provider
      value={{
        supabase,
        avatarGenerating, // is generated
        toggleAvatarGenerating, // change `avatarGenerating`
        generatedAvatar, // nextleg result
        setGeneratedAvatar, // nestlet response
        userSubscription, // current user subscription
        setUserSubscription, // set `userSubscription`
      }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};
