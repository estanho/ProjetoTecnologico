import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  let error = false;
  let publicKey;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.get(`${process.env.API_URL}/notification/public_key`, config);
    publicKey = result.data.publicKey;

  } catch (err) {
    error = true;
  }

  if (error) {
    return NextResponse.json({ error: true });
  }

  return NextResponse.json({ error: false, publicKey });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  const body = await request.json();

  let result;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    result = await axios.post(`${process.env.API_URL}/notification/register`, body, config);

    if (result.data.error === true) {
      throw new Error(result.data.message);
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: result?.data.message });
  }

  return NextResponse.json({ error: false });
}
