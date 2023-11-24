import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  let error = false;
  let students;
  let started;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.get(`${process.env.API_URL}/student`, config);
    students = result.data.students;
    started = result.data.started;
  } catch (err) {
    error = true;
  }

  if (error) {
    return NextResponse.json({ error: true });
  }

  return NextResponse.json({ error: false, students, started });
}

export async function POST(request: Request) {
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

  let result;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    result = await axios.post(
      `${process.env.API_URL}/student`,
      student,
      config,
    );

    if (result.data.error === true) {
      throw new Error(result.data.message);
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: result?.data.message });
  }

  return NextResponse.json({ error: false });
}
