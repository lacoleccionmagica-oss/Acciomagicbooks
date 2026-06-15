'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { money, computePedido } from '@/lib/calc';
import Modal from '@/components/Modal';
import Icon from '@/components/Icon';

const EMPTY = { nombre: '', telefono: '', instagram: '', direccion: '', preferencias: '', notas: '' };

export default function ClientesPage() {
  const supabase = createClient();
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const [c, p] = await Promise.all([
      supabase.from('clientes').select('*').order('nombre'),
      supabase.from('pedidos').select('id, cliente_id, cantidad, precio_unitario, sena, costo_unitario, estado_pago'),
    ]);
    setClientes(c.data || []);
    setPedidos(p.data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openNew() { setForm(EMPTY); setEditing({}); }
  function openEdit(c) { setForm({ ...c }); setEditing(c); }
  function close() { setEditing(null); }
  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  async function save() {
    if (!form.nombre.trim()) { alert('El nombre es obligatorio.'); return; }
    setSaving(true);
    const payload = {
      nombre: form.nombre, telefono: form.telefono, instagram: form.instagram,
      direccion: form.direccion, preferencias: form.preferencias, notas: form.notas,
    };
    if (editing?.id) {
      await supabase.from('clientes').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('clientes').insert(payload);
    }
    setSaving(false);
    close();
    load();
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) return;
    await supabase.from('clientes').delete().eq('id', id);
    load();
  }

  if (loading) return <p className="muted">Cargando...</p>;

  return (
    <>
      <div className="row between" style={{ marginBottom: 14 }}>
        <div></div>
        <button className="btn btn-primary" onClick={openNew}>+ Nuevo cliente</button>
      </div>

      {clientes.length === 0 ? (
        <div className="empty-state">
          <h3>No hay clientes todavía</h3>
          <p>Vas a poder ver el historial y total gastado de cada uno acá.</p>
          <button className="btn btn-primary" onClick={openNew}>+ Nuevo cliente</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Teléfono</th><th>Instagram</th><th>Dirección</th><th>Compras</th><th>Total gastado</th><th></th></tr>
            </thead>
            <tbody>
              {clientes.map((c) => {
                const compras = pedidos.filter((p) => p.cliente_id === c.id && p.estado_pago !== 'Cancelado');
                const total = compras.reduce((acc, p) => acc + computePedido(p).totalVenta, 0);
                return (
                  <tr key={c.id}>
                    <td className="wrap">
                      <b>{c.nombre}</b>
                      {c.notas && <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{c.notas}</div>}
                    </td>
                    <td>{c.telefono || '—'}</td>
                    <td>{c.instagram || '—'}</td>
                    <td className="wrap">{c.direccion || '—'}</td>
                    <td className="num">{compras.length}</td>
                    <td className="num">{money(total)}</td>
                    <td className="actions-cell">
                      <button className="icon-btn" title="Editar" onClick={() => openEdit(c)}><Icon name="edit" size={15} /></button>
                      <button className="icon-btn" title="Eliminar" onClick={() => remove(c.id)}><Icon name="trash" size={15} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'Editar cliente' : 'Nuevo cliente'} onClose={close} onSave={save} saving={saving}>
          <div className="form-grid">
            <div className="field full"><label>Nombre</label><input value={form.nombre} onChange={(e) => set('nombre', e.target.value)} /></div>
            <div className="field"><label>Teléfono</label><input value={form.telefono} onChange={(e) => set('telefono', e.target.value)} /></div>
            <div className="field"><label>Instagram</label><input value={form.instagram} onChange={(e) => set('instagram', e.target.value)} /></div>
            <div className="field full"><label>Dirección</label><input value={form.direccion} onChange={(e) => set('direccion', e.target.value)} /></div>
            <div className="field full"><label>Preferencias</label><input value={form.preferencias} onChange={(e) => set('preferencias', e.target.value)} /></div>
            <div className="field full"><label>Notas</label><textarea value={form.notas} onChange={(e) => set('notas', e.target.value)} /></div>
          </div>
        </Modal>
      )}
    </>
  );
}
