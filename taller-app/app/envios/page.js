'use client';

import { useState } from 'react';

const DEMO = [
  { id: 'ENV-001', pedidoId: 'PED-012', cliente: 'Valentina Rodríguez', direccion: 'Av. Santa Fe 1234 Piso 3', ciudad: 'Buenos Aires', provincia: 'CABA', transportista: 'oca', tracking: 'OCA9284710293', estado: 'en_camino', fechaDespacho: '2025-07-01', fechaEstimada: '2025-07-05', peso: '0.4kg', costo: 1800 },
  { id: 'ENV-002', pedidoId: 'PED-011', cliente: 'Matías López', direccion: 'Belgrano 450', ciudad: 'Rosario', provincia: 'Santa Fe', transportista: 'correo_argentino', tracking: 'AR982374819AR', estado: 'entregado', fechaDespacho: '2025-06-28', fechaEstimada: '2025-07-03', peso: '1.2kg', costo: 2400 },
  { id: 'ENV-003', pedidoId: 'PED-015', cliente: 'Carolina Méndez', direccion: 'Colón 890', ciudad: 'Córdoba', provincia: 'Córdoba', transportista: 'andreani', tracking: 'AND8827349102', estado: 'preparando', fechaDespacho: '—', fechaEstimada: '2025-07-08', peso: '2.1kg', costo: 3200 },
  { id: 'ENV-004', pedidoId: 'PED-009', cliente: 'Lucas Fernández', direccion: 'San Martín 123', ciudad: 'Tigre', provincia: 'Buenos Aires', transportista: 'retiro', tracking: '—', estado: 'despachado', fechaDespacho: '2025-07-02', fechaEstimada: '2025-07-04', peso: '0.2kg', costo: 0 },
];

const TRANSP = {
  correo_argentino: { label: 'Correo Argentino', color: '#c87810' },
  oca:              { label: 'OCA',               color: '#1a6aaa' },
  andreani:         { label: 'Andreani',           color: '#aa2a1a' },
  retiro:           { label: 'Retiro personal',    color: '#2a8a3a' },
};

const ESTADOS = {
  preparando: { label: 'Preparando', icon: '📦', color: '#a08840', bg: 'rgba(160,136,64,.15)' },
  despachado: { label: 'Despachado', icon: '🚀', color: '#1a8aaa', bg: 'rgba(26,138,170,.15)' },
  en_camino:  { label: 'En camino',  icon: '🚚', color: '#d4600a', bg: 'rgba(212,96,10,.15)'  },
  entregado:  { label: 'Entregado',  icon: '✅', color: '#2a8a3a', bg: 'rgba(42,138,58,.15)'  },
  problema:   { label: 'Problema',   icon: '⚠️', color: '#8a2a2a', bg: 'rgba(138,42,42,.15)'  },
};

const fmt = (n) => '$' + n.toLocaleString('es-AR');

const s = {
  page: { padding: 28, maxWidth: 1100 },
  h1: { fontSize: 22, fontWeight: 700, color: '#e8b840', marginBottom: 4 },
  sub: { fontSize: 13, color: '#5a4820', marginBottom: 0 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  btnPrimary: { background: 'linear-gradient(135deg,#8a6010,#d4600a)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 },
  statCard: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, padding: '16px 18px' },
  filters: { display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  chip: (on) => ({ background: on ? 'rgba(200,146,26,.2)' : '#111008', border: `1px solid ${on ? '#c8921a' : 'rgba(200,146,26,.18)'}`, borderRadius: 20, padding: '6px 14px', fontSize: 12, color: on ? '#e8b840' : '#a08840', cursor: 'pointer' }),
  table: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, overflow: 'hidden' },
  th: { padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#5a4820', letterSpacing: '0.8px', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { padding: '11px 14px', fontSize: 13 },
  drawer: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' },
  drawerPanel: { width: 400, height: '100%', background: '#111008', borderLeft: '1px solid rgba(200,146,26,.18)', padding: 28, overflowY: 'auto' },
};

export default function EnviosPage() {
  const [envios, setEnvios] = useState(DEMO);
  const [filtro, setFiltro] = useState('todos');
  const [selected, setSelected] = useState(null);

  const filtrados = filtro === 'todos' ? envios : envios.filter(e => e.estado === filtro);

  function cambiarEstado(id, estado) {
    setEnvios(prev => prev.map(e => e.id === id ? { ...e, estado } : e));
    setSelected(s => s?.id === id ? { ...s, estado } : s);
  }

  const stats = {
    preparando: envios.filter(e => e.estado === 'preparando').length,
    en_camino:  envios.filter(e => e.estado === 'en_camino').length,
    entregado:  envios.filter(e => e.estado === 'entregado').length,
    problema:   envios.filter(e => e.estado === 'problema').length,
  };

  return (
    <div style={s.page}>
      <div style={s.head}>
        <div>
          <h1 style={s.h1}>Envíos</h1>
          <p style={s.sub}>Seguimiento y gestión de todos los despachos</p>
        </div>
        <button style={s.btnPrimary}>+ Registrar envío</button>
      </div>

      <div style={s.stats}>
        {[
          { label: 'Preparando', value: stats.preparando, icon: '📦', color: '#a08840' },
          { label: 'En camino',  value: stats.en_camino,  icon: '🚚', color: '#d4600a' },
          { label: 'Entregados', value: stats.entregado,  icon: '✅', color: '#2a8a3a' },
          { label: 'Problemas',  value: stats.problema,   icon: '⚠️', color: '#8a2a2a' },
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#5a4820', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={s.filters}>
        {['todos', 'preparando', 'despachado', 'en_camino', 'entregado', 'problema'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={s.chip(filtro === f)}>
            {f === 'todos' ? 'Todos' : ESTADOS[f]?.label ?? f}
          </button>
        ))}
      </div>

      <div style={s.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,146,26,.18)' }}>
              {['ID', 'Pedido', 'Cliente', 'Destino', 'Transportista', 'Tracking', 'Estado', 'Entrega est.', ''].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map(e => {
              const est = ESTADOS[e.estado];
              const tr = TRANSP[e.transportista];
              return (
                <tr key={e.id} onClick={() => setSelected(e)} style={{ borderBottom: '1px solid rgba(200,146,26,.1)', cursor: 'pointer' }}
                  onMouseEnter={ev => ev.currentTarget.style.background = '#1a1508'}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}>
                  <td style={{ ...s.td, color: '#c8921a', fontWeight: 600 }}>{e.id}</td>
                  <td style={{ ...s.td, color: '#a08840' }}>{e.pedidoId}</td>
                  <td style={{ ...s.td, color: '#f0e0b0' }}>{e.cliente}</td>
                  <td style={{ ...s.td, color: '#a08840' }}>{e.ciudad}, {e.provincia}</td>
                  <td style={{ ...s.td, color: tr.color, fontWeight: 600 }}>{tr.label}</td>
                  <td style={{ ...s.td, color: '#5a4820', fontFamily: 'monospace', fontSize: 11 }}>{e.tracking}</td>
                  <td style={s.td}>
                    <span style={{ background: est.bg, color: est.color, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>
                      {est.icon} {est.label}
                    </span>
                  </td>
                  <td style={{ ...s.td, color: '#5a4820' }}>{e.fechaEstimada}</td>
                  <td style={s.td}><button onClick={ev => { ev.stopPropagation(); setSelected(e); }} style={{ background: '#1a1508', border: '1px solid rgba(200,146,26,.18)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#a08840', cursor: 'pointer' }}>Ver →</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={s.drawer} onClick={() => setSelected(null)}>
          <div style={s.drawerPanel} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: '#c8921a', fontWeight: 600 }}>{selected.id}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f0e0b0' }}>{selected.cliente}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#5a4820', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ background: '#1a1508', borderRadius: 8, padding: 14, marginBottom: 14 }}>
              {[['Dirección', selected.direccion], ['Ciudad', `${selected.ciudad}, ${selected.provincia}`], ['Transportista', TRANSP[selected.transportista].label], ['Tracking', selected.tracking], ['Peso', selected.peso], ['Costo', selected.costo > 0 ? fmt(selected.costo) : 'Gratis'], ['Despacho', selected.fechaDespacho], ['Entrega estimada', selected.fechaEstimada]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(200,146,26,.1)', fontSize: 12 }}>
                  <span style={{ color: '#5a4820' }}>{k}</span>
                  <span style={{ color: '#f0e0b0' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#5a4820', marginBottom: 8 }}>ACTUALIZAR ESTADO</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {['preparando', 'despachado', 'en_camino', 'entregado', 'problema'].map(st => {
                const cfg = ESTADOS[st];
                return (
                  <button key={st} onClick={() => cambiarEstado(selected.id, st)}
                    style={{ background: selected.estado === st ? cfg.bg : '#1a1508', border: `1px solid ${selected.estado === st ? cfg.color : 'rgba(200,146,26,.18)'}`, color: selected.estado === st ? cfg.color : '#5a4820', borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    {cfg.icon} {cfg.label}
                  </button>
                );
              })}
            </div>
            <button style={{ width: '100%', background: 'linear-gradient(135deg,#8a6010,#d4600a)', border: 'none', borderRadius: 8, padding: 11, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              🔗 Ver tracking online
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
