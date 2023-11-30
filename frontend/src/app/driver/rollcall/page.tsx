import { redirect } from 'next/navigation';
import NavBar from '../../../components/NavBar';
import RollCallList from './rollCallList';
import { createServerSupabaseClient } from '../../../components/supabaseServer';

export default async function Index() {
  const {
    data: { session },
  } = await createServerSupabaseClient().auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div>
      <NavBar user={session.user} role={session.user.user_metadata.role} />
      <RollCallList />
    </div>
  );
}
