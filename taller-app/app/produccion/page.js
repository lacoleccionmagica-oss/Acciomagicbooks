'use client';

import { useState } from 'react';

const TAREAS = [
  { id: 'PROD-001', pedidoId: 'PED-015', cliente: 'Carolina Méndez',    producto: 'Book Nook Castillo',  color: 'Dorado metalizado', cantidad: 1, prioridad: 'urgente', estado: 'imprimiendo', maquina: 'Ender 3 Pro', material: 'PLA+', tiempoEst: '8hs',   entrega: '2025-07-05', notas: 'Imprimir a 0.1mm para mejor detalle' },
  { id: 'PROD-002', pedidoId: 'PED-012', cliente: 'Valentina Rodríguez', producto: 'Separador Dragón',   color: 'Verde esmeralda',   cantidad: 3, prioridad: 'alta',    estado: 'pendiente',   maquina: 'Bambu A1',   material: 'PLA',  tiempoEst: '3hs',   entrega: '2025-07-06', notas: '' },
  { id: 'PROD-003', pedidoId: 'PED-014', cliente: 'Sofía Giménez',       producto: 'Llavero Varita',     color: 'Marrón chocolate',  cantidad: 5, prioridad: 'normal',  estado: 'pendiente',   maquina: 'Ender 3 Pro',material: 'PLA',  tiempoEst: '2hs',   entrega: '2025-07-08', notas: 'Agujero de 5mm para argolla' },
  { id: 'PROD-004', pedidoId: 'PED-011', cliente: 'Matías López',        producto: 'Separador Fénix',    color: 'Naranja fuego',     cantidad: 2, prioridad: 'alta',    estado: 'terminado',   maquina: 'Bambu A1',   material: 'PLA+', tiempoEst: '2.5hs', entrega: '2025-07-03', notas: '' },
  { id: 'PROD-005', pedidoId: 'PED-016', cliente: 'Diego Romero',        producto: 'Pin Broche Rayo',    color: 'Amarillo dorado',   cantidad: 10,prioridad: 'baja',    estado: 'pendiente',   maquina: 'Bambu A1',   material: 'PLA',  tiempoEst: '1.5hs', entrega: '2025-07-10', notas: '' },
  { id: 'PROD-006', pedidoId: 'PED-013', cliente: 'Ana Pereyra',         producto: 'Torre del Mago',     color: 'Gris piedra',       cantidad: 1, prioridad: 'urgente', estado: 'problema',    maquina: 'Ender 3 Pro',material: 'PLA+', tiempoEst: '10hs',  entrega: '2025-07-04', notas: '❌ Falla de adhesión en capa 40' },
];

const PRIO = { urgente: { label: 'Urgente', color: '#d4600a', bg: 'rgba(212,96,10,.2)',  ord: 0 }, alta: { label: 'Alta', color: '#c8921a', bg: 'rgba(200,146,26,.18)', ord: 1 }, normal: { label: 'Normal', color: '#1a8aaa', bg: 'rgba(26,138,170,.15)', ord: 2 }, baja: { label: 'Baja', color: '#5a5a5a', bg: 'rgba(90,90,90,.15)', ord: 3 } };
const EST  = { pendiente: { label: 'Pendiente', icon: '⏳', color: '#a08840', bg: 'rgba(160,136,64,.15)' }, imprimiendo: { label: 'Imprimiendo', icon: '🖨', color: '#d4600a', bg: 'rgba(212,96,10,.18)' }, terminado: { label: 'Terminado', icon: '✅', color: '#2a8a3a', bg: 'rgba(42,138,58,.15)' }, problema: { label: 'Problema', icon: '⚠️', color: '#8a2a2a', bg: 'rgba(138,42,42,.18)' } };
const DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const s = {
  page: { padding: 28, maxWidth: 1100 },
  h1: { fontSize: 22, fontWeight: 700, color: '#e8b840', marginBottom: 4 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  tabBtn: (on) => ({ background: on ? 'rgba(200,146,26,.2)' : '#111008', border: `1px solid ${on ? '#c8921a' : 'rgba(200,146,26,.18)'}`, borderRadius: 7, padding: '8px 16px', fontSize: 12, color: on ? '#e8b840' : '#a08840', cursor: 'pointer', fontWeight: on ? 600 : 400 }),
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 },
  statCard: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, padding: '16px 18px' },
  chip: (on) => ({ background: on ? 'rgba(200,146,26,.2)' : '#111008', border: `1px solid ${on ? '#c8921a' : 'rgba(200,146,26,.18)'}`, borderRadius: 20, padding: '6px 14px', fontSize: 12, color: on ? '#e8b840' : '#a08840', cursor: 'pointer' }),
  row: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 },
};

export default function ProduccionPage() {
  const [tareas, setTareas] = useState(TAREAS);
  const [vista, setVista] = useState('cola');
  const [filtro, setFiltro] = useState('todos');
  const [selected, setSelected] = useState(null);

  const ordenadas = [...tareas].sort((a, b) => PRIO[a.prioridad].ord - PRIO[b.prioridad].ord).filter(t => filtro === 'todos' || t.estado === filtro);

  function cambiarEstado(id, estado) {
    setTareas(prev => prev.map(t => t.id === id ? { ...t, estado } : t));
    setSelected(s => s?.id === id ? { ...s, estado } : s);
  }

  const stats = {
    imprimiendo: tareas.filter(t => t.estado === 'imprimiendo').length,
    pendientes:  tareas.filter(t => t.estado === 'pendiente').length,
    terminados:  tareas.filter(t => t.estado === 'terminado').length,
    problemas:   tareas.filter(t => t.estado === 'problema').length,
  };

  const hoy = new Date();
  const lunes = new Date(hoy); lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  const semana = Array.from({ length: 7 }, (_, i) => { const d = new Date(lunes); d.setDate(lunes.getDate() + i); return d; });

  return (
    <div style={s.page}>
      <div style={s.head}>
        <div>
          <h1 style={s.h1}>Cola de producción</h1>
          <p style={{ fontSize: 13, color: '#5a4820' }}>Qué imprimir hoy, prioridad y máquina asignada</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setVista('cola')} style={s.tabBtn(vista === 'cola')}>📋 Cola</button>
          <button onClick={() => setVista('calendario')} style={s.tabBtn(vista === 'calendario')}>📅 Calendario</button>
        </div>
      </div>

      <div style={s.stats}>
        {[
          { label: 'Imprimiendo', value: stats.imprimiendo, icon: '🖨', color: '#d4600a' },
          { label: 'En cola',     value: stats.pendientes,  icon: '⏳', color: '#c8921a' },
          { label: 'Terminados',  value: stats.terminados,  icon: '✅', color: '#2a8a3a' },
          { label: 'Problemas',   value: stats.problemas,   icon: '⚠️', color: '#8a2a2a' },
        ].map(st => (
          <div key={st.label} style={s.statCard}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{st.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: st.color }}>{st.value}</div>
            <div style={{ fontSize: 11, color: '#5a4820', marginTop: 2 }}>{st.label}</div>
          </div>
        ))}
      </div>

      {vista === 'cola' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {['todos', 'pendiente', 'imprimiendo', 'terminado', 'problema'].map(f => (
              <button key={f} onClick={() => setFiltro(f)} style={s.chip(filtro === f)}>
                {f === 'todos' ? 'Todos' : EST[f]?.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ordenadas.map((t, idx) => {
              const p = PRIO[t.prioridad]; const e = EST[t.estado];
              return (
                <div key={t.id} onClick={() => setSelected(t)} style={{ ...s.row, border: `1px solid ${t.estado === 'problema' ? 'rgba(138,42,42,.5)' : t.estado === 'imprimiendo' ? 'rgba(212,96,10,.4)' : 'rgba(200,146,26,.18)'}` }}
                  onMouseEnter={ev => ev.currentTarget.style.background = '#1a1508'}
                  onMouseLeave={ev => ev.currentTarget.style.background = '#111008'}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#3a2e12', minWidth: 28 }}>#{idx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#f0e0b0' }}>{t.producto}</span>
                      <span style={{ background: p.bg, color: p.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{p.label}</span>
                      <span style={{ background: e.bg, color: e.color, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{e.icon} {e.label}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#5a4820', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span>👤 {t.cliente}</span><span>🎨 {t.color}</span><span>📦 x{t.cantidad}</span><span>🖨 {t.maquina}</span><span>⏱ {t.tiempoEst}</span><span>📅 {t.entrega}</span>
                    </div>
                    {t.notas && <div style={{ fontSize: 11, color: t.estado === 'problema' ? '#c04040' : '#5a4820', marginTop: 4 }}>{t.notas}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {vista === 'calendario' && (
        <div style={{ background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
            {semana.map((dia, i) => {
              const isHoy = dia.toDateString() === hoy.toDateString();
              const iso = dia.toISOString().split('T')[0];
              const tareasDelDia = tareas.filter(t => t.entrega === iso);
              return (
                <div key={i} style={{ borderRight: i < 6 ? '1px solid rgba(200,146,26,.18)' : 'none' }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(200,146,26,.18)', background: isHoy ? 'rgba(200,146,26,.2)' : '#1a1508', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#5a4820', letterSpacing: 1 }}>{DIAS[dia.getDay()]}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: isHoy ? '#e8b840' : '#f0e0b0' }}>{dia.getDate()}</div>
                  </div>
                  <div style={{ padding: 8, minHeight: 120 }}>
                    {tareasDelDia.map(t => {
                      const p = PRIO[t.prioridad];
                      return (
                        <div key={t.id} onClick={() => setSelected(t)} style={{ background: p.bg, borderLeft: `2px solid ${p.color}`, borderRadius: 4, padding: '4px 7px', marginBottom: 5, cursor: 'pointer', fontSize: 10 }}>
                          <div style={{ color: '#f0e0b0', fontWeight: 600 }}>{t.producto}</div>
                          <div style={{ color: '#5a4820' }}>{t.cliente}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelected(null)}>
          <div style={{ width: 420, height: '100%', background: '#111008', borderLeft: '1px solid rgba(200,146,26,.18)', padding: 28, overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: '#c8921a', fontWeight: 600 }}>{selected.id} · {selected.pedidoId}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f0e0b0' }}>{selected.producto}</div>
                <div style={{ fontSize: 13, color: '#5a4820' }}>{selected.cliente}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#5a4820', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ background: '#1a1508', borderRadius: 8, padding: 14, marginBottom: 14 }}>
              {[['Color', selected.color], ['Cantidad', `x${selected.cantidad}`], ['Máquina', selected.maquina], ['Material', selected.material], ['Tiempo est.', selected.tiempoEst], ['Entrega', selected.entrega]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(200,146,26,.1)', fontSize: 12 }}>
                  <span style={{ color: '#5a4820' }}>{k}</span><span style={{ color: '#f0e0b0' }}>{v}</span>
                </div>
              ))}
              {selected.notas && <div style={{ marginTop: 10, fontSize: 12, color: '#c04040', background: 'rgba(138,42,42,.12)', borderRadius: 5, padding: '6px 10px' }}>{selected.notas}</div>}
            </div>
            <div style={{ fontSize: 11, color: '#5a4820', marginBottom: 8 }}>CAMBIAR ESTADO</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['pendiente', 'imprimiendo', 'terminado', 'problema'].map(st => {
                const cfg = EST[st];
                return <button key={st} onClick={() => cambiarEstado(selected.id, st)} style={{ background: selected.estado === st ? cfg.bg : '#1a1508', border: `1px solid ${selected.estado === st ? cfg.color : 'rgba(200,146,26,.18)'}`, color: selected.estado === st ? cfg.color : '#5a4820', borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{cfg.icon} {cfg.label}</button>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
