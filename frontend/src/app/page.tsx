import NavBar from '../components/NavBar';
import { Notification } from './utils/notification';
import Homepage from './homepage';
import supabaseServer from './utils/supabaseServer';

export default async function Index() {
  const {
    data: { session },
  } = await supabaseServer().auth.getSession();

  return (
    <div>
      {session?.user && <Notification session={session} />}
      <NavBar user={session?.user} role={session?.user.user_metadata.role} />
      <Homepage />
    </div>
  );
}
