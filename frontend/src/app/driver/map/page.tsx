import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Map from './Map';
import NavBar from '../../../components/NavBar';

export default async function NewRoutePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="h-full">
      <NavBar user={session?.user} role={session?.user.user_metadata.role} />
      <Map />
    </div>
  );
}
