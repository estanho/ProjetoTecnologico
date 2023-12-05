import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getSession();

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };

    const segments = request.url.split('/');
    const id = segments[segments.length - 1];

    const result = await axios.get(
      `${process.env.API_URL}/travel/trip/${id}`,
      config,
    );

    if (result.data.error === false) {
      const itinerary = result.data.travel;

      return NextResponse.json({ error: false, itinerary });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (error) {
    return NextResponse.json({ error: true, message: 'API' });
  }
}
