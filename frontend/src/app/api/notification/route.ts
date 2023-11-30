import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getSession();

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.get(
      `${process.env.API_URL}/notification/public_key`,
      config,
    );

    if (result.data.error === false) {
      const publicKey = result.data.publicKey;

      return NextResponse.json({ error: false, publicKey });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (error) {
    return NextResponse.json({ error: true, message: 'API' });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getSession();

    const body = await request.json();

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.post(
      `${process.env.API_URL}/notification/register`,
      body,
      config,
    );

    if (result.data.error === false) {
      return NextResponse.json({ error: false });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: 'API' });
  }
}
