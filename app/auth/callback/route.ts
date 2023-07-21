import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types_db'
import { useSupabase } from "@/app/supabase-provider";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const { userSubscription, setUserSubscription } = useSupabase();

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const userId = user.id;

      const { data, error } = await supabase.rpc('get_active_subscription_unit_amount', { user_id: userId });

      if (error) {
        console.error('Error fetching active subscription unit amount:', error);
        return null;
      }

      if (data && data.length > 0) {
        const { unit_amount } = data[0];
        setUserSubscription(unit_amount);
      }
    }

  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}