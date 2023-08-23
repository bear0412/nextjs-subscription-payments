import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

import {
  NEXTLEG_TOKEN,
  NEXTLEG_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL
} from '@/config/constant';
import type { Database } from 'types_db';

export async function POST(req: Request) {
  try {
    const { userId, button, buttonMessageId, generateCount } = await req.json();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NEXTLEG_TOKEN}`
    };

    console.log(button, buttonMessageId);
    const { data: res } = await axios.post(
      `${NEXTLEG_URL}/v2/button`,
      {
        button,
        buttonMessageId
      },
      { headers }
    );

    if (!res && !res.messageId) {
      console.log('Nextleg Query Error');
      throw new Error('Nextleg Query Error');
    }

    const supabaseAdmin = createClient<Database>(
      SUPABASE_URL || '',
      SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // const { error: insertError } = await supabaseAdmin.from('gallery').insert({
    //   user_id: userId,
    //   origin_message: res.messageId
    // });

    // if (insertError) {
    //   throw insertError;
    // }
    const { error } = await supabaseAdmin
      .from('gallery')
      .update({
        origin_message: res.messageId
      })
      .eq('origin_message', buttonMessageId)
      .eq('user_id', userId);
    if (error) {
      throw error;
    }

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ generate_count: generateCount - 1 })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    console.log('backend success', JSON.stringify(res, null, 2), generateCount);
    return new Response(JSON.stringify(res));
  } catch (error) {
    return new Response(JSON.stringify(error || 'failed'), {
      status: 500,
      statusText: JSON.stringify(error || 'failed')
    });
  }
}
