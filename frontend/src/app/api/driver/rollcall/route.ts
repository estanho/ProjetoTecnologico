import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data } = await supabase.auth.getSession();

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.get(`${process.env.API_URL}/rollcall`, config);

    if (result.data.error === false) {
      const studentTrip = result.data.result;

      return NextResponse.json({ error: false, studentTrip });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: 'API' });
  }
}
