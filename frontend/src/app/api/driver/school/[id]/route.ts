import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getSession();

    const body = await request.json();

    const segments = request.url.split('/');
    const id = segments[segments.length - 1];

    const school = {
      name: body.data.name,
      morning: body.data.morning,
      morning_arrival:
        body.data.morning === true ? body.data.morning_start : null,
      morning_departure:
        body.data.morning === true ? body.data.morning_end : null,
      afternoon: body.data.afternoon,
      afternoon_arrival:
        body.data.afternoon === true ? body.data.afternoon_start : null,
      afternoon_departure:
        body.data.afternoon === true ? body.data.afternoon_end : null,
      night: body.data.night,
      night_arrival: body.data.night === true ? body.data.night_start : null,
      night_departure: body.data.night === true ? body.data.night_end : null,
      location: {
        id: body.address_id,
        name: body.data.address,
        latitude: body.data.location.latitude,
        longitude: body.data.location.longitude,
        place_id: body.data.location.place_id,
      },
      default_location: {
        id: body.default_id,
        name: body.data.addressDefault,
        latitude: body.data.default_location.latitude,
        longitude: body.data.default_location.longitude,
        place_id: body.data.default_location.place_id,
      },
    };

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.put(
      `${process.env.API_URL}/school/${id}`,
      school,
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

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getSession();

    const body = await request.json();

    const segments = request.url.split('/');
    const id = segments[segments.length - 1];

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.patch(
      `${process.env.API_URL}/school/${id}`,
      body,
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

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.getSession();

    const segments = request.url.split('/');
    const id = segments[segments.length - 1];

    const config = {
      headers: { Authorization: `Bearer ${data.session?.access_token}` },
    };
    const result = await axios.delete(
      `${process.env.API_URL}/school/${id}`,
      config,
    );

    if (result.data.error === false) {
      return NextResponse.json({ error: false });
    } else {
      return NextResponse.json({ error: true, message: result.data.message });
    }
  } catch (err) {
    return NextResponse.json({ error: true, message: 'API' });
  }
}
