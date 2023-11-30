import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import SignupForm from './SignupForm';
import NavBar from '../../../components/NavBar';

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <NavBar />
      <SignupForm user={user} />
    </div>
  );
}
