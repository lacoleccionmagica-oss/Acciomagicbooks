'use client';

import { useState } from 'react';

const VENTAS = [
  { mes: 'Feb', hp: 18000, imp3d: 9000,  total: 27000 },
  { mes: 'Mar', hp: 24000, imp3d: 12000, total: 36000 },
  { mes: 'Abr', hp: 21000, imp3d: 14000, total: 35000 },
  { mes: 'May', hp: 32000, imp3d: 18000, total: 50000 },
  { mes: 'Jun', hp: 28000, imp3d: 22000, total: 50000 },
  { mes: 'Jul', hp: 15000, imp3d: 11000, total: 26000 },
];

const TOP = [
  { nombre: 'Separador Dragón 3D',           cat: 'Imp. 3D', vendidos: 28, ingresos: 70000 },
  { nombre: 'Colección 7 Libros HP',          cat: 'HP',      vendidos: 8,  ingresos: 64000 },
  { nombre: 'La Piedra Filosofal Ilustrada',  cat: 'HP',      vendidos: 18, ingresos: 58800 },
  { nombre: 'Llavero Varita Mágica',          cat: 'Imp. 3D', vendidos: 45, ingresos: 54000 },
  { nombre: 'Book Nook Castillo',             cat: 'Imp. 3D', vendidos: 6,  ingresos: 45000 },
];

const CLIENTES = [
  { nombre: 'Valentina Rodríguez', pedidos: 5, total: 42500 },
  { nombre: 'Carolina Méndez',     pedidos: 4, total: 38200 },
  { nombre: 'Matías López',        pedidos: 3, total: 29800 },
  { nombre: 'Sofía Giménez',       pedidos: 3, total: 24600 },
];

const fmt = (n) => '$' + n.toLocaleString('es-AR');

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.total));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 150, padding: '0 8px' }}>
      {data.map(d => (
        <div key={d.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 120, gap: 2 }}>
            <div title={`HP: ${fmt(d.hp)}`}    style={{ width: '55%', height: `${(d.hp    / max) * 110}px`, background: '#c8921a', borderRadius: '3px 3px 0 0', opacity: .85 }} />
            <div title={`3D: ${fmt(d.imp3d)}`} style={{ width: '55%', height: `${(d.imp3d / max) * 110}px`, background: '#d4600a', borderRadius: '3px 3px 0 0', opacity: .85 }} />
          </div>
          <div style={{ fontSize: 10, color: '#5a4820' }}>{d.mes}</div>
          <div style={{ fontSize: 9, color: '#e8b840', fontWeight: 600 }}>{fmt(d.total)}</div>
        </div>
      ))}
    </div>
  );
}

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState('mes');

  const totalIngresos = VENTAS.reduce((s, d) => s + d.total, 0);
  const totalHP       = VENTAS.reduce((s, d) => s + d.hp, 0);
  const total3D       = VENTAS.reduce((s, d) => s + d.imp3d, 0);
  const ticket        = Math.round(totalIngresos / 38);

  const s = {
    page: { padding: 28, maxWidth: 1100 },
    h1: { fontSize: 22, fontWeight: 700, color: '#e8b840', marginBottom: 4 },
    head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    tabBtn: (on) => ({ background: on ? 'rgba(200,146,26,.2)' : '#111008', border: `1px solid ${on ? '#c8921a' : 'rgba(200,146,26,.18)'}`, borderRadius: 7, padding: '7px 14px', fontSize: 12, color: on ? '#e8b840' : '#a08840', cursor: 'pointer', fontWeight: on ? 600 : 400 }),
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 },
    kpi: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, padding: '18px 18px 14px' },
    dual: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 },
    card: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, padding: '18px 18px 14px' },
    cardTitle: { fontSize: 13, fontWeight: 600, color: '#f0e0b0', marginBottom: 14 },
    th: { padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#5a4820', letterSpacing: '0.8px', textTransform: 'uppercase' },
    td: { padding: '11px 14px', fontSize: 13 },
  };

  return (
    <div style={s.page}>
      <div style={s.head}>
        <div>
          <h1 style={s.h1}>Reportes</h1>
          <p style={{ fontSize: 13, color: '#5a4820' }}>Resumen de ventas, productos y clientes</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['semana', 'mes', 'año'].map(p => (
            <button key={p} onClick={() => setPeriodo(p)} style={s.tabBtn(periodo === p)}>
              {p === 'semana' ? 'Esta semana' : p === 'mes' ? 'Este mes' : 'Este año'}
            </button>
          ))}
          <button style={{ ...s.tabBtn(false), marginLeft: 4 }}>⬇ Exportar</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={s.kpis}>
        {[
          { label: 'Ingresos totales', value: fmt(totalIngresos), sub: '+18% vs mes anterior', icon: '💰', color: '#e8b840', trend: true },
          { label: 'Ventas HP',        value: fmt(totalHP),       sub: `${Math.round(totalHP/totalIngresos*100)}% del total`, icon: '⚡', color: '#c080f0', trend: false },
          { label: 'Ventas 3D',        value: fmt(total3D),       sub: `${Math.round(total3D/totalIngresos*100)}% del total`, icon: '🖨', color: '#d4600a', trend: false },
          { label: 'Ticket promedio',  value: fmt(ticket),        sub: 'por pedido',           icon: '🧾', color: '#2a8a3a', trend: false },
        ].map(k => (
          <div key={k.label} style={s.kpi}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{k.icon}</span>
              {k.trend && <span style={{ fontSize: 10, background: 'rgba(42,138,58,.2)', color: '#2a8a3a', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>↑ +18%</span>}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: k.color, marginBottom: 3 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: '#5a4820' }}>{k.label}</div>
            <div style={{ fontSize: 10, color: '#3a2e12', marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + distribución */}
      <div style={s.dual}>
        <div style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={s.cardTitle}>Ingresos por mes</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#5a4820' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: '#c8921a', borderRadius: 2, display: 'inline-block' }} /> Harry Potter</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: '#d4600a', borderRadius: 2, display: 'inline-block' }} /> Impresiones 3D</span>
            </div>
          </div>
          <BarChart data={VENTAS} />
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Distribución de ventas</div>
          {[
            { label: 'Harry Potter',    pct: Math.round(totalHP    / totalIngresos * 100), color: '#c8921a' },
            { label: 'Impresiones 3D', pct: Math.round(total3D    / totalIngresos * 100), color: '#d4600a' },
          ].map(cat => (
            <div key={cat.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: '#a08840' }}>{cat.label}</span>
                <span style={{ color: cat.color, fontWeight: 700 }}>{cat.pct}%</span>
              </div>
              <div style={{ height: 8, background: '#1a1508', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${cat.pct}%`, height: '100%', background: cat.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid rgba(200,146,26,.18)', marginTop: 16, paddingTop: 14 }}>
            <div style={{ fontSize: 11, color: '#5a4820', marginBottom: 10, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Top clientes</div>
            {CLIENTES.map((c, i) => (
              <div key={c.nombre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < CLIENTES.length - 1 ? '1px solid rgba(200,146,26,.1)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#f0e0b0' }}>{c.nombre}</div>
                  <div style={{ fontSize: 10, color: '#5a4820' }}>{c.pedidos} pedidos</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e8b840' }}>{fmt(c.total)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top productos */}
      <div style={{ background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(200,146,26,.18)', fontSize: 13, fontWeight: 600, color: '#f0e0b0' }}>Productos más vendidos</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(200,146,26,.18)' }}>
              {['#', 'Producto', 'Categoría', 'Unidades', 'Ingresos', '% del total'].map(h => <th key={h} style={s.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {TOP.map((p, i) => {
              const isHP = p.cat === 'HP';
              return (
                <tr key={p.nombre} style={{ borderBottom: '1px solid rgba(200,146,26,.1)' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a1508'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ ...s.td, fontSize: 13, fontWeight: 700, color: '#3a2e12' }}>#{i + 1}</td>
                  <td style={{ ...s.td, color: '#f0e0b0', fontWeight: 500 }}>{p.nombre}</td>
                  <td style={s.td}>
                    <span style={{ background: isHP ? 'rgba(200,146,26,.15)' : 'rgba(212,96,10,.15)', color: isHP ? '#c8921a' : '#d4600a', fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20 }}>{p.cat}</span>
                  </td>
                  <td style={{ ...s.td, fontWeight: 600, color: '#f0e0b0' }}>{p.vendidos} uds.</td>
                  <td style={{ ...s.td, fontWeight: 700, color: '#e8b840' }}>{fmt(p.ingresos)}</td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: '#1a1508', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round(p.ingresos / totalIngresos * 100)}%`, height: '100%', background: isHP ? '#c8921a' : '#d4600a', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#5a4820', minWidth: 28 }}>{Math.round(p.ingresos / totalIngresos * 100)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
