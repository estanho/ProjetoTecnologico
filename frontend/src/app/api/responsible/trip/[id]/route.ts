import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  const body = await request.json();

  const segments = request.url.split('/');
  const id = segments[segments.length - 1];

  let result;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    result = await axios.patch(
      `${process.env.API_URL}/trips/${id}`,
      body,
      config,
    );

    if (result.data.error === true) {
      throw new Error(result.data.message);
    }
  } catch (err) {
    return NextResponse.json({ error: true });
  }

  return NextResponse.json({ error: false });
}
