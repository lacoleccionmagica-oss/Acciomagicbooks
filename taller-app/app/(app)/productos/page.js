'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { money, num, computeProducto } from '@/lib/calc';
import { OPTIONS } from '@/lib/constants';
import Modal from '@/components/Modal';
import Icon from '@/components/Icon';
import Tag from '@/components/Tag';

const EMPTY = {
  nombre: '', categoria: 'Impresión 3D', estado: 'Activo', canales: [],
  stock: 0, tiempo_produccion: 0,
  costo_material: 0, gramos: 0, horas_impresion: 0, costo_electrico: 0,
  packaging: 0, comisiones: 0, publicidad: 0, desgaste: 0, mano_obra: 0,
  margen_minimo: 30, precio_venta: 0, notas: '',
};

export default function ProductosPage() {
  const supabase = createClient();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('productos').select('*').order('nombre');
    setProductos(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openNew() { setForm(EMPTY); setEditing({}); }
  function openEdit(p) { setForm({ ...p, canales: p.canales || [] }); setEditing(p); }
  function close() { setEditing(null); }
  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }
  function toggleCanal(c) {
    setForm((f) => ({
      ...f,
      canales: f.canales.includes(c) ? f.canales.filter((x) => x !== c) : [...f.canales, c],
    }));
  }

  async function save() {
    if (!form.nombre.trim()) { alert('El nombre es obligatorio.'); return; }
    setSaving(true);
    const payload = {
      nombre: form.nombre, categoria: form.categoria, estado: form.estado, canales: form.canales,
      stock: num(form.stock), tiempo_produccion: num(form.tiempo_produccion),
      costo_material: num(form.costo_material), gramos: num(form.gramos), horas_impresion: num(form.horas_impresion),
      costo_electrico: num(form.costo_electrico), packaging: num(form.packaging), comisiones: num(form.comisiones),
      publicidad: num(form.publicidad), desgaste: num(form.desgaste), mano_obra: num(form.mano_obra),
      margen_minimo: num(form.margen_minimo), precio_venta: num(form.precio_venta), notas: form.notas,
    };
    if (editing?.id) {
      await supabase.from('productos').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('productos').insert(payload);
    }
    setSaving(false);
    close();
    load();
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    await supabase.from('productos').delete().eq('id', id);
    load();
  }

  if (loading) return <p className="muted">Cargando...</p>;

  const c = computeProducto(form);

  return (
    <>
      <div className="row between" style={{ marginBottom: 14 }}>
        <div></div>
        <button className="btn btn-primary" onClick={openNew}>+ Nuevo producto</button>
      </div>

      {productos.length === 0 ? (
        <div className="empty-state">
          <h3>No hay productos todavía</h3>
          <p>Cargá tus productos con su desglose de costos para saber cuánto ganás realmente con cada venta.</p>
          <button className="btn btn-primary" onClick={openNew}>+ Nuevo producto</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th><th>Estado</th><th>Stock</th><th>Costo total</th>
                <th>Precio mín. rentable</th><th>Precio venta</th><th>Ganancia neta</th><th>Margen</th><th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => {
                const calc = computeProducto(p);
                const margenBajo = calc.margen < num(p.margen_minimo);
                return (
                  <tr key={p.id}>
                    <td className="wrap">
                      <b>{p.nombre}</b>
                      <div className="muted" style={{ fontSize: 11.5 }}>{p.categoria}</div>
                    </td>
                    <td><Tag value={p.estado} /></td>
                    <td className="num">{p.stock}</td>
                    <td className="num">{money(calc.costoTotal)}</td>
                    <td className="num">{money(calc.precioMinimo)}</td>
                    <td className="num">{money(p.precio_venta)}</td>
                    <td className="num" style={{ color: 'var(--success)', fontWeight: 600 }}>{money(calc.gananciaNeta)}</td>
                    <td className="num" style={{ fontWeight: 700, color: margenBajo ? 'var(--warn)' : undefined }}>{calc.margen.toFixed(0)}%</td>
                    <td className="actions-cell">
                      <button className="icon-btn" title="Editar" onClick={() => openEdit(p)}><Icon name="edit" size={15} /></button>
                      <button className="icon-btn" title="Eliminar" onClick={() => remove(p.id)}><Icon name="trash" size={15} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'Editar producto' : 'Nuevo producto'} onClose={close} onSave={save} saving={saving} large>
          <div className="form-grid">
            <div className="field full"><label>Nombre del producto</label><input value={form.nombre} onChange={(e) => set('nombre', e.target.value)} /></div>
            <div className="field">
              <label>Categoría</label>
              <select value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
                {OPTIONS.categoriaProducto.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Estado</label>
              <select value={form.estado} onChange={(e) => set('estado', e.target.value)}>
                {OPTIONS.estadoProducto.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field"><label>Stock disponible</label><input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></div>
            <div className="field"><label>Tiempo de producción (hs)</label><input type="number" value={form.tiempo_produccion} onChange={(e) => set('tiempo_produccion', e.target.value)} /></div>
            <div className="field full">
              <label>Publicado en</label>
              <div className="checks">
                {OPTIONS.canalesPublicacion.map((c) => (
                  <label key={c}>
                    <input type="checkbox" checked={form.canales.includes(c)} onChange={() => toggleCanal(c)} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="section-title">Costos reales</div>
          <div className="form-grid">
            <div className="field"><label>Costo de material ($)</label><input type="number" value={form.costo_material} onChange={(e) => set('costo_material', e.target.value)} /></div>
            <div className="field"><label>Gramos usados</label><input type="number" value={form.gramos} onChange={(e) => set('gramos', e.target.value)} /></div>
            <div className="field"><label>Horas de impresión</label><input type="number" value={form.horas_impresion} onChange={(e) => set('horas_impresion', e.target.value)} /></div>
            <div className="field"><label>Costo eléctrico ($)</label><input type="number" value={form.costo_electrico} onChange={(e) => set('costo_electrico', e.target.value)} /></div>
            <div className="field"><label>Packaging ($)</label><input type="number" value={form.packaging} onChange={(e) => set('packaging', e.target.value)} /></div>
            <div className="field"><label>Comisiones ($)</label><input type="number" value={form.comisiones} onChange={(e) => set('comisiones', e.target.value)} /></div>
            <div className="field"><label>Publicidad asociada ($)</label><input type="number" value={form.publicidad} onChange={(e) => set('publicidad', e.target.value)} /></div>
            <div className="field"><label>Desgaste de impresora ($)</label><input type="number" value={form.desgaste} onChange={(e) => set('desgaste', e.target.value)} /></div>
            <div className="field"><label>Mano de obra ($)</label><input type="number" value={form.mano_obra} onChange={(e) => set('mano_obra', e.target.value)} /></div>
          </div>

          <div className="section-title">Precio</div>
          <div className="form-grid">
            <div className="field"><label>Margen mínimo deseado (%)</label><input type="number" value={form.margen_minimo} onChange={(e) => set('margen_minimo', e.target.value)} /></div>
            <div className="field"><label>Precio de venta ($)</label><input type="number" value={form.precio_venta} onChange={(e) => set('precio_venta', e.target.value)} /></div>
            <div className="field full"><label>Notas / archivos (STL, configuración, versión...)</label><textarea value={form.notas} onChange={(e) => set('notas', e.target.value)} /></div>
          </div>

          <div className="computed-box">
            <div><span className="muted">Costo total</span><b>{money(c.costoTotal)}</b></div>
            <div><span className="muted">Precio mínimo rentable</span><b>{money(c.precioMinimo)}</b></div>
            <div><span className="muted">Ganancia neta</span><b style={{ color: 'var(--accent-ink)' }}>{money(c.gananciaNeta)}</b></div>
            <div><span className="muted">Margen</span><b style={{ color: c.margen < num(form.margen_minimo) ? 'var(--warn)' : 'var(--accent-ink)' }}>{c.margen.toFixed(1)}%</b></div>
          </div>
        </Modal>
      )}
    </>
  );
}
