import NavBar from '../../../components/NavBar';
import SchoolList from './SchoolList';
import supabaseServer from '../../utils/supabaseServer';
import { redirect } from 'next/navigation';

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
      <SchoolList />
    </div>
  );
}
