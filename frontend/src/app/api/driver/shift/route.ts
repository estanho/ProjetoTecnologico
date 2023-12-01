import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data } = await supabase.auth.getSession();

    let shifts = {
      morning: false,
      afternoon: false,
      night: false,
    };

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.get(`${process.env.API_URL}/school`, config);

    if (result.data.error === false) {
      const schools = result.data.schools;

      for (let i = 0; i < schools.length; i++) {
        if (schools[i].morning === true) {
          shifts.morning = true;
        }
        if (schools[i].afternoon === true) {
          shifts.afternoon = true;
        }
        if (schools[i].night === true) {
          shifts.night = true;
        }
      }

      return NextResponse.json({ error: false, data: shifts });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: 'API' });
  }
}
