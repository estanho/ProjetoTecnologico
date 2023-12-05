import Map from './Map';
import NavBar from '../../../../components/NavBar';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function NewRoutePage({ params }: any) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="h-full">
      <NavBar user={session?.user} role={session?.user.user_metadata.role} />
      <Map trip_id={params.id} />
    </div>
  );
}
