import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  const segments = request.url.split('/');
  const id = segments[segments.length - 1];

  let result;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    result = await axios.delete(`${process.env.API_URL}/student/${id}`, config);

    if (result.data.error === true) {
      throw new Error(result.data.message);
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: result?.data.message });
  }

  return NextResponse.json({ error: false });
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  const body = await request.json();

  const segments = request.url.split('/');
  const id = segments[segments.length - 1];

  const student = {
    name: body.data.name,
    morning: body.data.shift === 'morning' ? true : false,
    afternoon: body.data.shift === 'afternoon' ? true : false,
    night: body.data.shift === 'night' ? true : false,
    school_id: body.data.school,
    location: {
      id: body.address_id,
      name: body.data.address,
      latitude: body.data.location.latitude,
      longitude: body.data.location.longitude,
      place_id: body.data.location.place_id,
    },
    responsibles: [],
  };

  let responsiblesBase = body.data.responsibles_email.split(', ');

  var responsiblesNew = responsiblesBase.filter((item: string, i: number) => {
    return responsiblesBase.indexOf(item) === i;
  });

  student.responsibles = responsiblesNew[0] === '' ? [] : responsiblesNew;

  let result;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    result = await axios.put(
      `${process.env.API_URL}/student/${id}`,
      student,
      config,
    );

    if (result.data.error) {
      throw new Error(result.data.message);
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: result?.data.message });
  }

  return NextResponse.json({ error: false });
}

export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  const body = await request.json();

  const segments = request.url.split('/');
  const id = segments[segments.length - 1];

  let result;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    result = await axios.patch(
      `${process.env.API_URL}/student/${id}`,
      body,
      config,
    );

    if (result.data.error) {
      throw new Error(result.data.message);
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: result?.data.message });
  }

  return NextResponse.json({ error: false });
}
