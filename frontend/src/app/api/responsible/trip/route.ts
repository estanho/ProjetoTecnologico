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
      `${process.env.API_URL}/trips/responsible`,
      config,
    );

    if (result.data.error === false) {
      const students = result.data.result;

      return NextResponse.json({ error: false, students });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: 'API' });
  }
}
