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
      `${process.env.API_URL}/trips/driver`,
      config,
    );

    if (result.data.error === false) {
      const trips = result.data.result;

      return NextResponse.json({ error: false, trips });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (error) {
    return NextResponse.json({ error: true, message: error });
  }
}
