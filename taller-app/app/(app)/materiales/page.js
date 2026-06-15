'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { money, fmtDate, num } from '@/lib/calc';
import { OPTIONS } from '@/lib/constants';
import Modal from '@/components/Modal';
import Icon from '@/components/Icon';

const EMPTY = {
  nombre: '', categoria: 'Filamento', unidad: 'g', stock_actual: 0, stock_minimo: 0,
  costo_unidad: 0, proveedor: '', ultima_compra: '', precio_compra_anterior: 0,
};

export default function MaterialesPage() {
  const supabase = createClient();
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('materiales').select('*').order('nombre');
    setMateriales(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openNew() { setForm(EMPTY); setEditing({}); }
  function openEdit(m) { setForm({ ...m }); setEditing(m); }
  function close() { setEditing(null); }

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  async function save() {
    if (!form.nombre.trim()) { alert('El nombre es obligatorio.'); return; }
    setSaving(true);
    const payload = {
      nombre: form.nombre,
      categoria: form.categoria,
      unidad: form.unidad,
      stock_actual: num(form.stock_actual),
      stock_minimo: num(form.stock_minimo),
      costo_unidad: num(form.costo_unidad),
      proveedor: form.proveedor,
      ultima_compra: form.ultima_compra || null,
      precio_compra_anterior: num(form.precio_compra_anterior),
    };
    if (editing?.id) {
      await supabase.from('materiales').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('materiales').insert(payload);
    }
    setSaving(false);
    close();
    load();
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este material? Esta acción no se puede deshacer.')) return;
    await supabase.from('materiales').delete().eq('id', id);
    load();
  }

  if (loading) return <p className="muted">Cargando...</p>;

  return (
    <>
      <div className="row between" style={{ marginBottom: 14 }}>
        <div></div>
        <button className="btn btn-primary" onClick={openNew}>+ Nuevo material</button>
      </div>

      {materiales.length === 0 ? (
        <div className="empty-state">
          <h3>No hay materiales cargados</h3>
          <p>Registrá tus filamentos e insumos para recibir alertas cuando estén por agotarse.</p>
          <button className="btn btn-primary" onClick={openNew}>+ Nuevo material</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Material</th><th>Stock actual</th><th>Stock mínimo</th><th>Costo / unidad</th>
                <th>Proveedor</th><th>Última compra</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {materiales.map((m) => {
                const bajo = num(m.stock_actual) <= num(m.stock_minimo);
                return (
                  <tr key={m.id}>
                    <td className="wrap">
                      <b>{m.nombre}</b>
                      <div className="muted" style={{ fontSize: 11.5 }}>{m.categoria}</div>
                    </td>
                    <td className="num" style={bajo ? { color: 'var(--danger)', fontWeight: 700 } : undefined}>{m.stock_actual} {m.unidad}</td>
                    <td className="num">{m.stock_minimo} {m.unidad}</td>
                    <td className="num">{money(m.costo_unidad)}</td>
                    <td>{m.proveedor || '—'}</td>
                    <td className="mono">{fmtDate(m.ultima_compra)}</td>
                    <td>{bajo ? <span className="tag tag-danger">Reponer</span> : <span className="tag tag-ok">OK</span>}</td>
                    <td className="actions-cell">
                      <button className="icon-btn" title="Editar" onClick={() => openEdit(m)}><Icon name="edit" size={15} /></button>
                      <button className="icon-btn" title="Eliminar" onClick={() => remove(m.id)}><Icon name="trash" size={15} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'Editar material' : 'Nuevo material'} onClose={close} onSave={save} saving={saving}>
          <div className="form-grid">
            <div className="field full"><label>Nombre</label><input value={form.nombre} onChange={(e) => set('nombre', e.target.value)} /></div>
            <div className="field">
              <label>Categoría</label>
              <select value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
                {OPTIONS.categoriaMaterial.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Unidad</label>
              <select value={form.unidad} onChange={(e) => set('unidad', e.target.value)}>
                {OPTIONS.unidadMaterial.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field"><label>Stock actual</label><input type="number" value={form.stock_actual} onChange={(e) => set('stock_actual', e.target.value)} /></div>
            <div className="field"><label>Stock mínimo</label><input type="number" value={form.stock_minimo} onChange={(e) => set('stock_minimo', e.target.value)} /></div>
            <div className="field"><label>Costo por unidad ($)</label><input type="number" value={form.costo_unidad} onChange={(e) => set('costo_unidad', e.target.value)} /></div>
            <div className="field"><label>Proveedor</label><input value={form.proveedor} onChange={(e) => set('proveedor', e.target.value)} /></div>
            <div className="field"><label>Última fecha de compra</label><input type="date" value={form.ultima_compra || ''} onChange={(e) => set('ultima_compra', e.target.value)} /></div>
            <div className="field"><label>Precio de compra anterior ($)</label><input type="number" value={form.precio_compra_anterior} onChange={(e) => set('precio_compra_anterior', e.target.value)} /></div>
          </div>
        </Modal>
      )}
    </>
  );
}
