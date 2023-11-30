import NavBar from '../../../components/NavBar';
import Trips from './TripList';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '../../utils/supabaseServer';

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
      <Trips />
    </div>
  );
}
