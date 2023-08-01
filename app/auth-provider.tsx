"use client"
import { Session } from "@supabase/gotrue-js/src/lib/types"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { AUTH_TOKEN_NAME, EMPTY_TOKEN } from "@/config/constant";
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
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")
  const [generateCount, setGenerateCount] = useState(0)
  const [session, setSession] = useState<Session | null>(null)
  const [token, storeToken] = useLocalStorage(AUTH_TOKEN_NAME, EMPTY_TOKEN);
  const router = useRouter()

  useEffect(() => {
    async function getSession() {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();
        // console.log("getsession's session", session)
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
        case "INITIAL_SESSION":
          console.log("INITIAL_SESSION")
        case "TOKEN_REFRESHED":
          console.log("TOKEN_REFRESHED")
        case "SIGNED_IN":
          console.log("SIGNED_IN")
          if (session) {
            const { user: { id: authUserId } } = session
            setUserId(authUserId);
            setSession(session)
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
          console.log("SIGNED_OUT")
          setUserId("")
          setSession(null)
          break;
        case "PASSWORD_RECOVERY":
          console.log("PASSWORD_RECOVERY")
          setUserId("")
          setSession(null)
          break;
        case "MFA_CHALLENGE_VERIFIED":
          console.log("MFA_CHALLENGE_VERIFIED")
          break;
        case "USER_UPDATED":
          console.log("USER_UPDATED")
          break;

        default:
          break;
      }
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  useEffect(() => {
    setLoading(false)
  }, [session])


  return (
    <>{
      !loading
        ? (<Context.Provider
          value={{
            userId,
            session,
            generateCount,
            setGenerateCount
          }}>
          <>{children}</>
        </Context.Provider>)
        : (<div className="absolute w-full h-full top-0 bg-[#00000099] z-50">
          <img
            src="/loader.gif"
            alt="loading"
            className="h-48 mx-auto"
          />
        </div>)
    }</>
  );
}

export const useAuth = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
