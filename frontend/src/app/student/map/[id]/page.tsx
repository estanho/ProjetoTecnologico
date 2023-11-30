import Map from './Map';
import NavBar from '../../../../components/NavBar';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '../../../../components/supabaseServer';

export default async function NewRoutePage({ params }: any) {
  const {
    data: { session },
  } = await createServerSupabaseClient().auth.getSession();

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
