import { redirect } from 'next/navigation';
import NavBar from '../../../components/NavBar';
import Trips from './TripList';
import supabaseServer from '../../utils/supabaseServer';

export default async function Index() {
  const {
    data: { session },
  } = await supabaseServer().auth.getSession();

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
