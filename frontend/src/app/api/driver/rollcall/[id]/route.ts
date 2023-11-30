import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getSession();

    const body = await request.json();

    const segments = request.url.split('/');
    const id = segments[segments.length - 1];

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.patch(
      `${process.env.API_URL}/rollcall/${id}`,
      body,
      config,
    );

    if (result.data.error === false) {
      return NextResponse.json({
        error: false,
        result: result.data.allPresents,
      });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (error) {
    return NextResponse.json({ error: true, message: 'API' });
  }
}
