import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Shell from '@/components/Shell';

export default async function AppLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return <Shell profile={profile}>{children}</Shell>;
}
