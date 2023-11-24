import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  let error = false;
  let notifications;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.get(`${process.env.API_URL}/notification/list`, config);
    notifications = result.data.notifications;
  } catch (err) {
    error = true;
  }

  if (error) {
    return NextResponse.json({ error: true });
  }

  return NextResponse.json({ error: false, notifications });
}