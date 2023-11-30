import NavBar from '../components/NavBar';
import { Notification } from './utils/notification';
import Homepage from './homepage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      {session?.user && <Notification session={session} />}
      <NavBar user={session?.user} role={session?.user.user_metadata.role} />
      <Homepage />
    </div>
  );
}
