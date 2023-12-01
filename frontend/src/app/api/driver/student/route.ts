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
    const result = await axios.get(`${process.env.API_URL}/student`, config);

    if (result.data.error === false) {
      const students = result.data.students;
      const started = result.data.started;

      return NextResponse.json({ error: false, students, started });
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

    const student = {
      name: body.name,
      morning: body.shift === 'morning' ? true : false,
      afternoon: body.shift === 'afternoon' ? true : false,
      night: body.shift === 'night' ? true : false,
      school_id: body.school,
      location: {
        name: body.address,
        latitude: body.location.latitude,
        longitude: body.location.longitude,
        place_id: body.location.place_id,
      },
      responsibles: [],
    };

    let responsiblesBase = body.responsibles_email.split(', ');

    var responsiblesNew = responsiblesBase.filter((item: string, i: number) => {
      return responsiblesBase.indexOf(item) === i;
    });

    student.responsibles = responsiblesNew[0] === '' ? [] : responsiblesNew;

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.post(
      `${process.env.API_URL}/student`,
      student,
      config,
    );

    if (result.data.error === false) {
      return NextResponse.json({ error: false });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (error) {
    return NextResponse.json({ error: true, message: 'API' });
  }
}
