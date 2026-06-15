'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fmtDate } from '@/lib/calc';
import Modal from '@/components/Modal';
import Icon from '@/components/Icon';

const EMPTY = { email: '', password: '', full_name: '', role: 'empleado' };

export default function UsuariosClient({ currentUserId }) {
  const supabase = createClient();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at');
    setUsuarios(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  async function crear() {
    setError('');
    if (!form.email.trim() || !form.password.trim()) {
      setError('Completá el email y la contraseña.');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'No se pudo crear el usuario.');
      return;
    }
    setForm(EMPTY);
    setOpen(false);
    load();
  }

  async function cambiarRol(u, nuevoRol) {
    await supabase.from('profiles').update({ role: nuevoRol }).eq('id', u.id);
    load();
  }

  async function eliminar(u) {
    if (u.id === currentUserId) { alert('No podés eliminar tu propio usuario.'); return; }
    if (!confirm(`¿Eliminar el usuario ${u.email}? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/usuarios/${u.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'No se pudo eliminar el usuario.');
      return;
    }
    load();
  }

  if (loading) return <p className="muted">Cargando...</p>;

  return (
    <>
      <div className="row between" style={{ marginBottom: 14 }}>
        <p className="muted" style={{ fontSize: 13, maxWidth: 480 }}>
          Creá accesos para las personas que trabajan con vos. Cada usuario ve y edita los mismos datos del taller.
        </p>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setError(''); setOpen(true); }}>+ Nuevo usuario</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Email</th><th>Nombre</th><th>Rol</th><th>Alta</th><th></th></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.email}{u.id === currentUserId && <span className="tag tag-progress" style={{ marginLeft: 6 }}>vos</span>}</td>
                <td>{u.full_name || '—'}</td>
                <td>
                  <select value={u.role} onChange={(e) => cambiarRol(u, e.target.value)} disabled={u.id === currentUserId}>
                    <option value="empleado">Empleado</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="mono">{fmtDate(u.created_at?.slice(0, 10))}</td>
                <td className="actions-cell">
                  <button className="icon-btn" title="Eliminar" onClick={() => eliminar(u)} disabled={u.id === currentUserId}>
                    <Icon name="trash" size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title="Nuevo usuario" onClose={() => setOpen(false)} onSave={crear} saving={saving} saveLabel="Crear usuario">
          {error && <div className="login-error">{error}</div>}
          <div className="form-grid">
            <div className="field full"><label>Nombre completo</label><input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} /></div>
            <div className="field full"><label>Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
            <div className="field"><label>Contraseña</label><input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} /></div>
            <div className="field">
              <label>Rol</label>
              <select value={form.role} onChange={(e) => set('role', e.target.value)}>
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <p className="hint" style={{ marginTop: 8 }}>La persona va a poder iniciar sesión de inmediato con este email y contraseña.</p>
        </Modal>
      )}
    </>
  );
}
