'use client';

import { useState } from 'react';

const ARCHIVOS = [
  { id: 'ARC-001', nombre: 'dragon_separador_v3.stl',  tipo: 'stl',   producto: 'Separador Dragón',   categoria: 'Separadores', tamaño: '2.4 MB', fecha: '2025-06-15', impresiones: 12, notas: 'Versión final. Escala 1:1 para Ender.' },
  { id: 'ARC-002', nombre: 'fenix_ascendente_v2.stl',  tipo: 'stl',   producto: 'Separador Fénix',    categoria: 'Separadores', tamaño: '1.8 MB', fecha: '2025-06-20', impresiones: 6,  notas: '' },
  { id: 'ARC-003', nombre: 'castillo_booknook_v1.stl', tipo: 'stl',   producto: 'Book Nook Castillo', categoria: 'Book Nooks',  tamaño: '8.1 MB', fecha: '2025-06-28', impresiones: 2,  notas: 'Imprimir con soporte. 15% infill.' },
  { id: 'ARC-004', nombre: 'torre_mago_v1.gcode',      tipo: 'gcode', producto: 'Torre del Mago',     categoria: 'Book Nooks',  tamaño: '45 MB',  fecha: '2025-07-01', impresiones: 1,  notas: 'Configurado para Bambu A1, 0.2mm' },
  { id: 'ARC-005', nombre: 'varita_llavero_v4.stl',    tipo: 'stl',   producto: 'Llavero Varita',     categoria: 'Accesorios',  tamaño: '0.9 MB', fecha: '2025-05-10', impresiones: 28, notas: '' },
  { id: 'ARC-006', nombre: 'pin_rayo_v2.stl',          tipo: 'stl',   producto: 'Pin Broche Rayo',    categoria: 'Accesorios',  tamaño: '0.4 MB', fecha: '2025-06-01', impresiones: 15, notas: 'Agujero de 3mm para el pin.' },
  { id: 'ARC-007', nombre: 'catalogo_impresiones.pdf', tipo: 'pdf',   producto: '—',                  categoria: 'Documentos',  tamaño: '3.2 MB', fecha: '2025-07-01', impresiones: 0,  notas: 'Catálogo actualizado para clientes' },
  { id: 'ARC-008', nombre: 'lechuza_articulada.stl',   tipo: 'stl',   producto: 'Lechuza Mágica',     categoria: 'Separadores', tamaño: '3.6 MB', fecha: '2025-06-25', impresiones: 4,  notas: 'Piezas por separado: cuerpo + alas.' },
];

const TIPOS = {
  stl:   { label: 'STL',    icon: '🧊', color: '#1a8aaa', bg: 'rgba(26,138,170,.15)' },
  gcode: { label: 'G-Code', icon: '⚙️', color: '#d4600a', bg: 'rgba(212,96,10,.15)'  },
  pdf:   { label: 'PDF',    icon: '📄', color: '#8a2a2a', bg: 'rgba(138,42,42,.15)'  },
  otro:  { label: 'Otro',   icon: '📎', color: '#5a5a5a', bg: 'rgba(90,90,90,.15)'   },
};

const CATS = ['Todas', 'Separadores', 'Book Nooks', 'Accesorios', 'Documentos'];

const s = {
  page: { padding: 28, maxWidth: 1100 },
  h1: { fontSize: 22, fontWeight: 700, color: '#e8b840', marginBottom: 4 },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  btnPrimary: { background: 'linear-gradient(135deg,#8a6010,#d4600a)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 },
  statCard: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, padding: '16px 18px' },
  chip: (on) => ({ background: on ? 'rgba(200,146,26,.2)' : '#111008', border: `1px solid ${on ? '#c8921a' : 'rgba(200,146,26,.18)'}`, borderRadius: 20, padding: '6px 14px', fontSize: 12, color: on ? '#e8b840' : '#a08840', cursor: 'pointer' }),
  table: { background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, overflow: 'hidden' },
  th: { padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#5a4820', letterSpacing: '0.8px', textTransform: 'uppercase' },
  td: { padding: '11px 14px', fontSize: 13 },
};

export default function ArchivosPage() {
  const [cat, setCat] = useState('Todas');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [vistaGrid, setVistaGrid] = useState(false);

  const filtrados = ARCHIVOS.filter(a => {
    const mC = cat === 'Todas' || a.categoria === cat;
    const mS = a.nombre.toLowerCase().includes(search.toLowerCase()) || a.producto.toLowerCase().includes(search.toLowerCase());
    return mC && mS;
  });

  return (
    <div style={s.page}>
      <div style={s.head}>
        <div>
          <h1 style={s.h1}>Archivos y diseños</h1>
          <p style={{ fontSize: 13, color: '#5a4820' }}>Biblioteca de STL, G-Code y documentos del taller</p>
        </div>
        <button style={s.btnPrimary}>+ Subir archivo</button>
      </div>

      <div style={s.stats}>
        {[
          { label: 'Archivos STL',        value: ARCHIVOS.filter(a => a.tipo === 'stl').length, icon: '🧊', color: '#1a8aaa' },
          { label: 'Total archivos',       value: ARCHIVOS.length,                               icon: '📁', color: '#c8921a' },
          { label: 'Impresiones totales',  value: ARCHIVOS.reduce((s, a) => s + a.impresiones, 0), icon: '🖨', color: '#d4600a' },
          { label: 'Categorías',           value: CATS.length - 1,                               icon: '🗂', color: '#2a8a3a' },
        ].map(st => (
          <div key={st.label} style={s.statCard}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{st.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: st.color }}>{st.value}</div>
            <div style={{ fontSize: 11, color: '#5a4820', marginTop: 2 }}>{st.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar archivo o producto..."
          style={{ background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 7, padding: '8px 13px', color: '#f0e0b0', fontSize: 13, outline: 'none', width: 240 }} />
        {CATS.map(c => <button key={c} onClick={() => setCat(c)} style={s.chip(cat === c)}>{c}</button>)}
        <button onClick={() => setVistaGrid(!vistaGrid)} style={{ marginLeft: 'auto', background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 7, padding: '7px 12px', fontSize: 13, color: '#a08840', cursor: 'pointer' }}>
          {vistaGrid ? '☰ Lista' : '⊞ Grilla'}
        </button>
      </div>

      {!vistaGrid ? (
        <div style={s.table}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(200,146,26,.18)' }}>
                {['Archivo', 'Tipo', 'Producto', 'Categoría', 'Tamaño', 'Impresiones', 'Fecha', ''].map(h => <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(a => {
                const tc = TIPOS[a.tipo] || TIPOS.otro;
                return (
                  <tr key={a.id} onClick={() => setSelected(a)} style={{ borderBottom: '1px solid rgba(200,146,26,.1)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1a1508'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...s.td, color: '#f0e0b0', fontFamily: 'monospace', fontSize: 12 }}>{a.nombre}</td>
                    <td style={s.td}><span style={{ background: tc.bg, color: tc.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{tc.icon} {tc.label}</span></td>
                    <td style={{ ...s.td, color: '#a08840' }}>{a.producto}</td>
                    <td style={{ ...s.td, color: '#5a4820' }}>{a.categoria}</td>
                    <td style={{ ...s.td, color: '#5a4820', fontFamily: 'monospace' }}>{a.tamaño}</td>
                    <td style={{ ...s.td, color: '#c8921a', fontWeight: 600 }}>{a.impresiones}x</td>
                    <td style={{ ...s.td, color: '#5a4820' }}>{a.fecha}</td>
                    <td style={s.td}><button onClick={e => { e.stopPropagation(); setSelected(a); }} style={{ background: '#1a1508', border: '1px solid rgba(200,146,26,.18)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#a08840', cursor: 'pointer' }}>Ver →</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
          {filtrados.map(a => {
            const tc = TIPOS[a.tipo] || TIPOS.otro;
            return (
              <div key={a.id} onClick={() => setSelected(a)} style={{ background: '#111008', border: '1px solid rgba(200,146,26,.18)', borderRadius: 10, padding: 16, cursor: 'pointer', textAlign: 'center', transition: 'transform .15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>{tc.icon}</div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#a08840', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.nombre}</div>
                <span style={{ background: tc.bg, color: tc.color, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3 }}>{tc.label}</span>
                <div style={{ fontSize: 11, color: '#5a4820', marginTop: 6 }}>{a.impresiones} impresiones</div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelected(null)}>
          <div style={{ width: 400, height: '100%', background: '#111008', borderLeft: '1px solid rgba(200,146,26,.18)', padding: 28, overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{(TIPOS[selected.tipo] || TIPOS.otro).icon}</div>
                <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#f0e0b0', wordBreak: 'break-all' }}>{selected.nombre}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#5a4820', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ background: '#1a1508', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              {[['Producto', selected.producto], ['Categoría', selected.categoria], ['Tamaño', selected.tamaño], ['Impresiones', `${selected.impresiones}x`], ['Subido', selected.fecha]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(200,146,26,.1)', fontSize: 12 }}>
                  <span style={{ color: '#5a4820' }}>{k}</span><span style={{ color: '#f0e0b0' }}>{v}</span>
                </div>
              ))}
              {selected.notas && <div style={{ marginTop: 10, fontSize: 12, color: '#a08840', background: '#0a0800', borderRadius: 5, padding: '7px 10px' }}>{selected.notas}</div>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, background: '#1a1508', border: '1px solid rgba(200,146,26,.18)', borderRadius: 8, padding: 10, fontSize: 12, color: '#a08840', cursor: 'pointer' }}>⬇ Descargar</button>
              <button style={{ flex: 1, background: 'linear-gradient(135deg,#8a6010,#d4600a)', border: 'none', borderRadius: 8, padding: 10, fontSize: 12, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>🖨 Mandar a cola</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
