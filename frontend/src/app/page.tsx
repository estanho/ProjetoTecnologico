import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import NavBar from '../components/NavBar';

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      <NavBar user={session?.user} role={session?.user.user_metadata.role} />
    </div>
  );
}
