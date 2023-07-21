"use client"
import { Session } from "@supabase/gotrue-js/src/lib/types"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { SetValue } from "@/config/type"

type AuthContext = {
  userId: string;
  generateCount: number;
  setGenerateCount: SetValue<number>;
  session: Session | null;
};

const Context = createContext<AuthContext | undefined>(undefined);

export default function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createPagesBrowserClient())
  const [userId, setUserId] = useState("")
  const [generateCount, setGenerateCount] = useState(0)
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    console.log("authprovider useeffect");
    async function getSession() {
      // const supabase = createServerSupabaseClient();
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error('Error:', error);
        setSession(null);
      }
    }

    getSession();

    return () => {
      setSession(null)
    }
  }, [])


  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case "SIGNED_IN":
          if (session) {
            setSession(session)
            const { user: { id: authUserId } } = session
            setUserId(authUserId);
            const { data: countData, error } = await supabase.from("users").select("generate_count").eq("id", authUserId)
            if (error) {
              console.log(error)
            }
            if (countData) {
              const count = countData[0].generate_count
              setGenerateCount(count)
            }
          }
          break;
        case "SIGNED_OUT":
          setUserId("")
          setSession(null)
          break;
        case "PASSWORD_RECOVERY":
          setUserId("")
          setSession(null)
          break;
        case "INITIAL_SESSION":
        case "MFA_CHALLENGE_VERIFIED":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":

        default:
          break;
      }
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Context.Provider
      value={{
        userId,
        session,
        generateCount,
        setGenerateCount
      }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
