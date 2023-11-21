import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import NavBar from '../../../components/NavBar';
import NotificationList from './components/NotificationList';
import { redirect } from 'next/navigation';

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id)
    .single();

  if (data?.role === 'DriverRole') {
    return redirect('/');
  }

  return (
    <div>
      <NavBar user={user} />
      <NotificationList />
    </div>
  );
}
