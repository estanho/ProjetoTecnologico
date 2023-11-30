import Map from './Map';
import NavBar from '../../../../components/NavBar';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default async function NewRoutePage({ params }: any) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div className="h-full">
      <NavBar user={session?.user} role={session?.user.user_metadata.role} />
      <Map student_id={params.id} />
    </div>
  );
}
