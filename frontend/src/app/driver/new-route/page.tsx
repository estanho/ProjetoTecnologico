import Map from '../../../components/Map';
import NavBar from '../../../components/NavBar';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function NewRoutePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="h-full">
      <NavBar user={user} />
      <Map />
    </div>
  );
}
