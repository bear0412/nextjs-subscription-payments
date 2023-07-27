import axios from "axios";
import { createClient } from '@supabase/supabase-js';

import { NEXTLOG_TOKEN, NEXTLOG_URL } from "@/config/constant";
import type { Database } from 'types_db';

export async function POST(req: Request) {
  try {
    const { userId, cmd, imageUrl, prompt, generateCount } = await req.json();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NEXTLOG_TOKEN}`,
    };

    console.log({ headers, msg: `${imageUrl} ${prompt}` })

    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const { data: res } = await axios.post(
      `${NEXTLOG_URL}`,
      {
        cmd,
        msg: `${imageUrl} ${prompt}`
      },
      { headers }
    );

    if (res && res.messageId) {
      throw new Error('Nextleg Query Error')
    }

    const { error: insertError } = await supabaseAdmin
      .from('gallery')
      .insert({
        user_id: userId,
        image_link: imageUrl,
        origin_message: res.messageId
      })

    if (insertError) {
      throw insertError
    }

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ generate_count: generateCount - 1 })
      .eq('id', userId)

    if (updateError) {
      throw updateError
    }

    console.log("backend success", JSON.stringify(res, null, 2), generateCount);
    return new Response(JSON.stringify(res));
  } catch (error) {
    return new Response(JSON.stringify(error || "failed"), { status: 500, statusText: JSON.stringify(error || "failed") })
  }
}
