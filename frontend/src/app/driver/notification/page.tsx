import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NavBar from '../../../components/NavBar';
import NotificationList from './NotificationList';

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  if (session.user.user_metadata.role !== 'DriverRole') {
    return redirect('/');
  }

  return (
    <div>
      <NavBar user={session.user} role={session.user.user_metadata.role} />
      <NotificationList />
    </div>
  );
}
