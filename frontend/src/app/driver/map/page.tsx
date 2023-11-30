import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Map from './Map';
import NavBar from '../../../components/NavBar';

export const dynamic = 'force-dynamic';

export default async function NewRoutePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div className="h-full">
      <NavBar user={session?.user} role={session?.user.user_metadata.role} />
      <Map />
    </div>
  );
}
