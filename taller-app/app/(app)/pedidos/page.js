'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { money, fmtDate, todayISO, num, computeProducto, computePedido } from '@/lib/calc';
import { OPTIONS } from '@/lib/constants';
import Modal from '@/components/Modal';
import Icon from '@/components/Icon';
import Tag from '@/components/Tag';

const EMPTY = {
  cliente_id: '', producto_id: '', cantidad: 1,
  fecha_pedido: todayISO(), fecha_entrega: '',
  estado_produccion: 'Pendiente', estado_entrega: 'Pendiente', estado_pago: 'Por pagar',
  medio_pago: '', canal_venta: '', sena: 0, costo_unitario: 0, precio_unitario: 0, notas: '',
};

const ALL_STATUSES = [...new Set([...OPTIONS.estadoProduccion, ...OPTIONS.estadoEntrega, ...OPTIONS.estadoPago])];

export default function PedidosPage() {
  const supabase = createClient();
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [newClienteNombre, setNewClienteNombre] = useState('');
  const [saving, setSaving] = useState(false);

  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCanal, setFiltroCanal] = useState('');
  const [busqueda, setBusqueda] = useState('');

  async function load() {
    const [p, c, pr] = await Promise.all([
      supabase.from('pedidos').select('*'),
      supabase.from('clientes').select('*').order('nombre'),
      supabase.from('productos').select('*').order('nombre'),
    ]);
    setPedidos(p.data || []);
    setClientes(c.data || []);
    setProductos(pr.data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const byId = (arr, id) => arr.find((x) => x.id === id);

  function openNew() {
    setForm({ ...EMPTY, fecha_pedido: todayISO() });
    setNewClienteNombre('');
    setEditing({});
  }
  function openEdit(p) { setForm({ ...p }); setNewClienteNombre(''); setEditing(p); }
  function close() { setEditing(null); }
  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  function onProductoChange(prodId) {
    const prod = byId(productos, prodId);
    if (prod) {
      const c = computeProducto(prod);
      setForm((f) => ({ ...f, producto_id: prodId, costo_unitario: c.costoTotal, precio_unitario: num(prod.precio_venta) }));
    } else {
      setForm((f) => ({ ...f, producto_id: prodId }));
    }
  }

  async function save() {
    let clienteId = form.cliente_id;
    if (!form.producto_id) { alert('Elegí un producto.'); return; }

    if (clienteId === '__new__') {
      const nombre = newClienteNombre.trim();
      if (!nombre) { alert('Escribí el nombre del nuevo cliente.'); return; }
      const { data, error } = await supabase.from('clientes').insert({ nombre }).select().single();
      if (error) { alert('No se pudo crear el cliente.'); return; }
      clienteId = data.id;
    }
    if (!clienteId) { alert('Elegí o creá un cliente.'); return; }

    setSaving(true);
    const payload = {
      cliente_id: clienteId,
      producto_id: form.producto_id,
      cantidad: num(form.cantidad) || 1,
      fecha_pedido: form.fecha_pedido || null,
      fecha_entrega: form.fecha_entrega || null,
      estado_produccion: form.estado_produccion,
      estado_entrega: form.estado_entrega,
      estado_pago: form.estado_pago,
      medio_pago: form.medio_pago,
      canal_venta: form.canal_venta,
      sena: num(form.sena),
      costo_unitario: num(form.costo_unitario),
      precio_unitario: num(form.precio_unitario),
      notas: form.notas,
    };
    if (editing?.id) {
      await supabase.from('pedidos').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('pedidos').insert(payload);
    }
    setSaving(false);
    close();
    load();
  }

  async function remove(id) {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return;
    await supabase.from('pedidos').delete().eq('id', id);
    load();
  }

  if (loading) return <p className="muted">Cargando...</p>;

  let lista = [...pedidos];
  if (filtroEstado) {
    lista = lista.filter((p) => p.estado_produccion === filtroEstado || p.estado_entrega === filtroEstado || p.estado_pago === filtroEstado);
  }
  if (filtroCanal) lista = lista.filter((p) => p.canal_venta === filtroCanal);
  if (busqueda) {
    const s = busqueda.toLowerCase();
    lista = lista.filter((p) => {
      const c = byId(clientes, p.cliente_id), pr = byId(productos, p.producto_id);
      return (c && c.nombre.toLowerCase().includes(s)) || (pr && pr.nombre.toLowerCase().includes(s)) || (p.notas || '').toLowerCase().includes(s);
    });
  }
  lista.sort((a, b) => (b.fecha_pedido || '').localeCompare(a.fecha_pedido || ''));

  const c = computePedido(form);

  return (
    <>
      <div className="row between" style={{ marginBottom: 14 }}>
        <div className="filters">
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filtroCanal} onChange={(e) => setFiltroCanal(e.target.value)}>
            <option value="">Todos los canales</option>
            {OPTIONS.canalVenta.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="search" placeholder="Buscar cliente, producto, nota..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Nuevo pedido</button>
      </div>

      {pedidos.length === 0 ? (
        <div className="empty-state">
          <h3>No hay pedidos todavía</h3>
          <p>Creá tu primer pedido para empezar a llevar el control.</p>
          <button className="btn btn-primary" onClick={openNew}>+ Nuevo pedido</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cliente</th><th>Producto</th><th>Cant.</th><th>Entrega</th>
                <th>Producción</th><th>Entrega (estado)</th><th>Pago</th>
                <th>Total</th><th>Saldo</th><th>Ganancia</th><th></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 ? (
                <tr><td colSpan={11} className="muted" style={{ textAlign: 'center', padding: 24 }}>No hay pedidos con esos filtros.</td></tr>
              ) : lista.map((p) => {
                const cl = byId(clientes, p.cliente_id), pr = byId(productos, p.producto_id);
                const calc = computePedido(p);
                return (
                  <tr key={p.id}>
                    <td className="wrap"><b>{cl ? cl.nombre : '—'}</b></td>
                    <td className="wrap">{pr ? pr.nombre : '—'}</td>
                    <td className="num">{p.cantidad}</td>
                    <td className="mono">{fmtDate(p.fecha_entrega)}</td>
                    <td><Tag value={p.estado_produccion} /></td>
                    <td><Tag value={p.estado_entrega} /></td>
                    <td><Tag value={p.estado_pago} /></td>
                    <td className="num">{money(calc.totalVenta)}</td>
                    <td className="num">{money(calc.saldo)}</td>
                    <td className="num" style={{ color: 'var(--success)', fontWeight: 600 }}>{money(calc.ganancia)}</td>
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
        <Modal title={editing.id ? 'Editar pedido' : 'Nuevo pedido'} onClose={close} onSave={save} saving={saving} large>
          <div className="form-grid">
            <div className="field full">
              <label>Cliente</label>
              <select value={form.cliente_id} onChange={(e) => set('cliente_id', e.target.value)}>
                <option value="">— seleccionar —</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                <option value="__new__">+ Nuevo cliente...</option>
              </select>
            </div>
            {form.cliente_id === '__new__' && (
              <div className="field full">
                <label>Nombre del cliente nuevo</label>
                <input value={newClienteNombre} onChange={(e) => setNewClienteNombre(e.target.value)} placeholder="Nombre y apellido" />
              </div>
            )}

            <div className="field full">
              <label>Producto</label>
              <select value={form.producto_id} onChange={(e) => onProductoChange(e.target.value)}>
                <option value="">— seleccionar —</option>
                {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
              {productos.length === 0 && <div className="hint">No tenés productos cargados. Agregá uno primero en &quot;Productos y costos&quot;.</div>}
            </div>

            <div className="field"><label>Cantidad</label><input type="number" min="1" value={form.cantidad} onChange={(e) => set('cantidad', e.target.value)} /></div>
            <div className="field">
              <label>Canal de venta</label>
              <select value={form.canal_venta} onChange={(e) => set('canal_venta', e.target.value)}>
                <option value=""></option>
                {OPTIONS.canalVenta.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="field"><label>Fecha del pedido</label><input type="date" value={form.fecha_pedido || ''} onChange={(e) => set('fecha_pedido', e.target.value)} /></div>
            <div className="field"><label>Fecha prometida de entrega</label><input type="date" value={form.fecha_entrega || ''} onChange={(e) => set('fecha_entrega', e.target.value)} /></div>

            <div className="field"><label>Costo unitario ($)</label><input type="number" value={form.costo_unitario} onChange={(e) => set('costo_unitario', e.target.value)} /></div>
            <div className="field"><label>Precio de venta unitario ($)</label><input type="number" value={form.precio_unitario} onChange={(e) => set('precio_unitario', e.target.value)} /></div>

            <div className="field">
              <label>Estado de producción</label>
              <select value={form.estado_produccion} onChange={(e) => set('estado_produccion', e.target.value)}>
                {OPTIONS.estadoProduccion.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Estado de entrega</label>
              <select value={form.estado_entrega} onChange={(e) => set('estado_entrega', e.target.value)}>
                {OPTIONS.estadoEntrega.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Estado de pago</label>
              <select value={form.estado_pago} onChange={(e) => set('estado_pago', e.target.value)}>
                {OPTIONS.estadoPago.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Medio de pago</label>
              <select value={form.medio_pago} onChange={(e) => set('medio_pago', e.target.value)}>
                <option value=""></option>
                {OPTIONS.medioPago.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="field"><label>Seña abonada ($)</label><input type="number" value={form.sena} onChange={(e) => set('sena', e.target.value)} /></div>
            <div className="field full"><label>Notas internas</label><textarea value={form.notas} onChange={(e) => set('notas', e.target.value)} /></div>
          </div>

          <div className="computed-box">
            <div><span className="muted">Costo total</span><b>{money(c.costoTotal)}</b></div>
            <div><span className="muted">Total venta</span><b>{money(c.totalVenta)}</b></div>
            <div><span className="muted">Saldo pendiente</span><b>{money(c.saldo)}</b></div>
            <div><span className="muted">Ganancia</span><b style={{ color: 'var(--accent-ink)' }}>{money(c.ganancia)}</b></div>
          </div>
        </Modal>
      )}
    </>
  );
}
