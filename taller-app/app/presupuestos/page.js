'use client';

import { useState } from 'react';

const DEMO = [
  { id: 'PRE-001', cliente: 'Valentina Rodríguez', descripcion: 'Kit separadores dragón x3 + llavero', monto: 8900, estado: 'aprobado', fecha: '2025-06-28', vencimiento: '2025-07-12', items: [{ nombre: 'Separador Dragón 3D', qty: 3, precio: 2500 }, { nombre: 'Llavero Varita', qty: 1, precio: 1400 }] },
  { id: 'PRE-002', cliente: 'Matías López', descripcion: 'Book Nook Castillo personalizado', monto: 9200, estado: 'enviado', fecha: '2025-07-01', vencimiento: '2025-07-15', items: [{ nombre: 'Book Nook Castillo (dorado)', qty: 1, precio: 9200 }] },
  { id: 'PRE-003', cliente: 'Carolina Méndez', descripcion: 'Colección HP + separadores', monto: 42500, estado: 'borrador', fecha: '2025-07-03', vencimiento: '2025-07-17', items: [{ nombre: 'Colección 7 Libros HP', qty: 1, precio: 38000 }, { nombre: 'Separador Fénix', qty: 2, precio: 2250 }] },
  { id: 'PRE-004', cliente: 'Lucas Fernández', descripcion: 'Pins x10 + llaveros x5', monto: 14000, estado: 'rechazado', fecha: '2025-06-20', vencimiento: '2025-07-04', items: [{ nombre: 'Pin Broche Mágico', qty: 10, precio: 800 }, { nombre: 'Llavero Varita', qty: 5, precio: 1200 }] },
];

const ESTADOS = {
  borrador:  { label: 'Borrador',  color: '#a08840', bg: 'rgba(160,136,64,.15)'  },
  enviado:   { label: 'Enviado',   color: '#1a8aaa', bg: 'rgba(26,138,170,.15)'  },
  aprobado:  { label: 'Aprobado',  color: '#2a8a3a', bg: 'rgba(42,138,58,.15)'   },
  rechazado: { label: 'Rechazado', color: '#8a2a2a', bg: 'rgba(138,42,42,.15)'   },
};

const fmt = (n) => '$' + n.toLocaleString('es-AR');

const s = {
  page: { padding: 28, maxWidth: 1100 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  h1: { fontSize: 22, fontWeight: 700, color: '#e8b840', marginBottom: 4 },
  sub: { fontSize: 13, color: '#5a4820' },
  btnPrimary: { background: 'linear-gradient(135deg,#8a6010,#d4600a)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 },
  statCard: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, padding: '16px 18px' },
  statNum: { fontSize: 22, fontWeight: 700, marginBottom: 3 },
  statLbl: { fontSize: 11, color: '#5a4820' },
  filters: { display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' },
  input: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 7, padding: '8px 13px', color: '#f0e0b0', fontSize: 13, outline: 'none', width: 220 },
  chip: (on) => ({ background: on ? 'rgba(200,146,26,.2)' : '#111008', border: `1px solid ${on ? '#c8921a' : 'rgba(200,146,26,.18)'}`, borderRadius: 20, padding: '6px 14px', fontSize: 12, color: on ? '#e8b840' : '#a08840', cursor: 'pointer' }),
  table: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, overflow: 'hidden' },
  th: { padding: '11px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#5a4820', letterSpacing: '0.8px', textTransform: 'uppercase' },
  td: { padding: '12px 16px', fontSize: 13 },
  badge: (est) => ({ background: ESTADOS[est].bg, color: ESTADOS[est].color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }),
  drawer: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' },
  drawerPanel: { width: 400, height: '100%', background: '#111008', borderLeft: '1px solid rgba(200,146,26,.18)', padding: 28, overflowY: 'auto' },
  btnClose: { background: 'none', border: 'none', color: '#5a4820', fontSize: 20, cursor: 'pointer' },
  label: { fontSize: 11, color: '#c8921a', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: 5 },
  formInput: { width: '100%', background: '#1a1508', border: '1px solid rgba(200,146,26,.18)', borderRadius: 8, padding: '9px 12px', color: '#f0e0b0', fontSize: 13, outline: 'none', marginBottom: 13 },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalBox: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 12, padding: 28, width: 480 },
};

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState(DEMO);
  const [filtro, setFiltro] = useState('todos');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const filtrados = presupuestos.filter(p => {
    const mF = filtro === 'todos' || p.estado === filtro;
    const mS = p.cliente.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return mF && mS;
  });

  const totalAprobado = presupuestos.filter(p => p.estado === 'aprobado').reduce((s, p) => s + p.monto, 0);

  function cambiarEstado(id, estado) {
    setPresupuestos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
    setSelected(s => s?.id === id ? { ...s, estado } : s);
  }

  return (
    <div style={s.page}>
      <div style={s.head}>
        <div>
          <h1 style={s.h1}>Presupuestos</h1>
          <p style={s.sub}>Creá y gestioná cotizaciones para tus clientes</p>
        </div>
        <button style={s.btnPrimary} onClick={() => setShowForm(true)}>+ Nuevo presupuesto</button>
      </div>

      <div style={s.stats}>
        {[
          { label: 'Total aprobado', value: fmt(totalAprobado), icon: '💰', color: '#e8b840' },
          { label: 'Aprobados', value: presupuestos.filter(p => p.estado === 'aprobado').length, icon: '✅', color: '#2a8a3a' },
          { label: 'Pendientes', value: presupuestos.filter(p => p.estado === 'enviado' || p.estado === 'borrador').length, icon: '⏳', color: '#d4600a' },
          { label: 'Rechazados', value: presupuestos.filter(p => p.estado === 'rechazado').length, icon: '❌', color: '#8a2a2a' },
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ ...s.statNum, color: stat.color }}>{stat.value}</div>
            <div style={s.statLbl}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={s.filters}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente o ID..." style={s.input} />
        {['todos', 'borrador', 'enviado', 'aprobado', 'rechazado'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={s.chip(filtro === f)}>
            {f === 'todos' ? 'Todos' : ESTADOS[f].label}
          </button>
        ))}
      </div>

      <div style={s.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,146,26,.18)' }}>
              {['ID', 'Cliente', 'Descripción', 'Monto', 'Estado', 'Vencimiento', ''].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id} onClick={() => setSelected(p)} style={{ borderBottom: '1px solid rgba(200,146,26,.1)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a1508'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ ...s.td, color: '#c8921a', fontWeight: 600 }}>{p.id}</td>
                <td style={{ ...s.td, color: '#f0e0b0' }}>{p.cliente}</td>
                <td style={{ ...s.td, color: '#a08840', maxWidth: 180 }}>{p.descripcion}</td>
                <td style={{ ...s.td, color: '#e8b840', fontWeight: 600 }}>{fmt(p.monto)}</td>
                <td style={s.td}><span style={s.badge(p.estado)}>{ESTADOS[p.estado].label}</span></td>
                <td style={{ ...s.td, color: '#5a4820' }}>{p.vencimiento}</td>
                <td style={s.td}><button onClick={e => { e.stopPropagation(); setSelected(p); }} style={{ background: '#1a1508', border: '1px solid rgba(200,146,26,.18)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#a08840', cursor: 'pointer' }}>Ver →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={s.drawer} onClick={() => setSelected(null)}>
          <div style={s.drawerPanel} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: '#c8921a', fontWeight: 600 }}>{selected.id}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f0e0b0' }}>{selected.cliente}</div>
              </div>
              <button onClick={() => setSelected(null)} style={s.btnClose}>✕</button>
            </div>
            <div style={{ background: '#1a1508', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#5a4820', marginBottom: 8 }}>ITEMS</div>
              {selected.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < selected.items.length - 1 ? '1px solid rgba(200,146,26,.1)' : 'none', fontSize: 13 }}>
                  <span style={{ color: '#a08840' }}>{item.qty}x {item.nombre}</span>
                  <span style={{ color: '#e8b840', fontWeight: 600 }}>{fmt(item.qty * item.precio)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(200,146,26,.3)' }}>
                <span style={{ color: '#f0e0b0', fontWeight: 700 }}>Total</span>
                <span style={{ color: '#e8b840', fontWeight: 700, fontSize: 16 }}>{fmt(selected.monto)}</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#5a4820', marginBottom: 8 }}>CAMBIAR ESTADO</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {['borrador', 'enviado', 'aprobado', 'rechazado'].map(e => (
                <button key={e} onClick={() => cambiarEstado(selected.id, e)}
                  style={{ background: selected.estado === e ? ESTADOS[e].bg : '#1a1508', border: `1px solid ${selected.estado === e ? ESTADOS[e].color : 'rgba(200,146,26,.18)'}`, color: selected.estado === e ? ESTADOS[e].color : '#5a4820', borderRadius: 20, padding: '5px 13px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  {ESTADOS[e].label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ flex: 1, background: '#1a1508', border: '1px solid rgba(200,146,26,.18)', borderRadius: 8, padding: 10, fontSize: 12, color: '#a08840', cursor: 'pointer' }}>📄 PDF</button>
              <button style={{ flex: 1, background: 'linear-gradient(135deg,#8a6010,#d4600a)', border: 'none', borderRadius: 8, padding: 10, fontSize: 12, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>💬 WhatsApp</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div style={s.modal} onClick={() => setShowForm(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#e8b840', marginBottom: 20 }}>Nuevo presupuesto</div>
            {['Cliente', 'Descripción', 'Monto estimado'].map(label => (
              <div key={label}>
                <label style={s.label}>{label}</label>
                <input placeholder={`Ej: ${label === 'Cliente' ? 'Valentina García' : label === 'Monto estimado' ? '5000' : 'Kit separadores'}`} style={s.formInput} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: '#1a1508', border: '1px solid rgba(200,146,26,.18)', borderRadius: 8, padding: 10, color: '#a08840', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: 'linear-gradient(135deg,#8a6010,#d4600a)', border: 'none', borderRadius: 8, padding: 10, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
