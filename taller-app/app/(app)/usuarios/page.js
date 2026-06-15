import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import UsuariosClient from './UsuariosClient';

export default async function UsuariosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (profile?.role !== 'admin') {
    return (
      <div className="empty-state">
        <h3>Acceso restringido</h3>
        <p>Esta sección es solo para administradores.</p>
      </div>
    );
  }

  return <UsuariosClient currentUserId={user.id} />;
}
