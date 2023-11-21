import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  let error = false;
  let schools;
  let started;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.get(`${process.env.API_URL}/school`, config);
    schools = result.data.schools;
    started = result.data.started;
  } catch (err) {
    error = true;
  }

  if (error) {
    return NextResponse.json({ error: true });
  }

  return NextResponse.json({ error: false, schools, started });
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data } = await supabase.auth.getSession();

  const body = await request.json();

  const school = {
    name: body.name,
    morning: body.morning,
    morning_arrival: body.morning === true ? body.morning_start : null,
    morning_departure: body.morning === true ? body.morning_end : null,
    afternoon: body.afternoon,
    afternoon_arrival: body.afternoon === true ? body.afternoon_start : null,
    afternoon_departure: body.afternoon === true ? body.afternoon_end : null,
    night: body.night,
    night_arrival: body.night === true ? body.night_start : null,
    night_departure: body.night === true ? body.night_end : null,
    location: {
      name: body.address,
      latitude: body.location.latitude,
      longitude: body.location.longitude,
      place_id: body.location.place_id,
    },
    default_location: {
      name: body.addressDefault,
      latitude: body.default_location.latitude,
      longitude: body.default_location.longitude,
      place_id: body.default_location.place_id,
    },
  };

  let result;

  try {
    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    result = await axios.post(`${process.env.API_URL}/school`, school, config);

    if (result.data.error === true) {
      throw new Error(result.data.message);
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: result?.data.message });
  }

  return NextResponse.json({ error: false });
}
