import AccountForm from './account-form';
import NavBar from '../../components/NavBar';
import { redirect } from 'next/navigation';
import supabaseServer from '../utils/supabaseServer';

export default async function Account() {
  const {
    data: { session },
  } = await supabaseServer().auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div>
      <NavBar user={session.user} role={session.user.user_metadata.role} />
      <AccountForm user={session.user} />
    </div>
  );
}
