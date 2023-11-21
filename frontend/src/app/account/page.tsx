import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AccountForm from './account-form';
import NavBar from '../../components/NavBar';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

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
