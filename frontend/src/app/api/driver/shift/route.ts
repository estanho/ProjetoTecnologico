import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  let error = false;
  let result;

  let shifts = {
    morning: false,
    afternoon: false,
    night: false,
  };

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    result = await axios.get(`${process.env.API_URL}/school`, config);
    result = result.data.schools;

    for (let i = 0; i < result.length; i++) {
      if (result[i].morning === true) {
        shifts.morning = true;
      }
      if (result[i].afternoon === true) {
        shifts.afternoon = true;
      }
      if (result[i].night === true) {
        shifts.night = true;
      }
    }
  } catch (err) {
    error = true;
  }

  if (error) {
    return NextResponse.json({ error: true });
  }

  return NextResponse.json({ error: false, data: shifts });
}
