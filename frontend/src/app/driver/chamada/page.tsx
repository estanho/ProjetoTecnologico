import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import NavBar from '../../../components/NavBar';
import StudentList from './components/StudentList';

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <NavBar user={user} />
      <StudentList />
    </div>
  );
}
