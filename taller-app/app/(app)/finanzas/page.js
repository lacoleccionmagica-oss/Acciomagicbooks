'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { money, num, todayISO, monthKey, monthLabel, computePedido } from '@/lib/calc';

export default function FinanzasPage() {
  const supabase = createClient();
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState(todayISO().slice(0, 7));

  useEffect(() => {
    (async () => {
      const [p, pr] = await Promise.all([
        supabase.from('pedidos').select('*'),
        supabase.from('productos').select('*'),
      ]);
      setPedidos(p.data || []);
      setProductos(pr.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="muted">Cargando...</p>;

  const byId = (arr, id) => arr.find((x) => x.id === id);

  const months = new Set();
  pedidos.forEach((p) => { if (p.fecha_pedido) months.add(monthKey(p.fecha_pedido)); });
  months.add(todayISO().slice(0, 7));
  const monthList = [...months].sort().reverse();
  const selected = monthList.includes(mes) ? mes : monthList[0];

  const pedidosMes = pedidos.filter((p) => monthKey(p.fecha_pedido) === selected);
  let ventas = 0, costos = 0, ganancia = 0, cobrado = 0, porCobrar = 0, comisiones = 0, materialesCosto = 0;
  pedidosMes.forEach((p) => {
    if (p.estado_pago === 'Cancelado') return;
    const c = computePedido(p);
    ventas += c.totalVenta;
    costos += c.costoTotal;
    ganancia += c.ganancia;
    if (p.estado_pago === 'Pagado completo') cobrado += c.totalVenta;
    else porCobrar += c.saldo;
    const prod = byId(productos, p.producto_id);
    if (prod) {
      comisiones += num(prod.comisiones) * num(p.cantidad);
      materialesCosto += num(prod.costo_material) * num(p.cantidad);
    }
  });

  const gananciaPorProducto = {};
  pedidos.forEach((p) => {
    if (p.estado_pago === 'Cancelado') return;
    gananciaPorProducto[p.producto_id] = (gananciaPorProducto[p.producto_id] || 0) + computePedido(p).ganancia;
  });
  const topRentables = Object.entries(gananciaPorProducto)
    .map(([id, g]) => ({ producto: byId(productos, id), g }))
    .filter((x) => x.producto)
    .sort((a, b) => b.g - a.g)
    .slice(0, 5);

  return (
    <>
      <div className="row" style={{ marginBottom: 14 }}>
        <div className="field" style={{ minWidth: 180 }}>
          <label>Mes</label>
          <select value={selected} onChange={(e) => setMes(e.target.value)}>
            {monthList.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
          </select>
        </div>
      </div>

      <div className="cards">
        <div className="card"><div className="kpi-label">Ventas del mes</div><div className="kpi-value">{money(ventas)}</div></div>
        <div className="card"><div className="kpi-label">Costos del mes</div><div className="kpi-value">{money(costos)}</div></div>
        <div className="card accent"><div className="kpi-label">Ganancia neta</div><div className="kpi-value">{money(ganancia)}</div></div>
        <div className="card"><div className="kpi-label">Cobrado</div><div className="kpi-value">{money(cobrado)}</div></div>
        <div className="card warn"><div className="kpi-label">Por cobrar</div><div className="kpi-value">{money(porCobrar)}</div></div>
        <div className="card"><div className="kpi-label">Comisiones estimadas</div><div className="kpi-value">{money(comisiones)}</div></div>
        <div className="card"><div className="kpi-label">Gasto en materiales</div><div className="kpi-value">{money(materialesCosto)}</div></div>
        <div className="card"><div className="kpi-label">Pedidos del mes</div><div className="kpi-value">{pedidosMes.length}</div></div>
      </div>

      <div className="box" style={{ marginTop: 18 }}>
        <h3>Productos más rentables (histórico)</h3>
        {topRentables.length ? (
          <ul>
            {topRentables.map((x) => (
              <li key={x.producto.id}>
                <span>{x.producto.nombre}</span>
                <span className="mono" style={{ color: 'var(--success)', fontWeight: 600 }}>{money(x.g)}</span>
              </li>
            ))}
          </ul>
        ) : <p className="muted" style={{ fontSize: 13 }}>Todavía no hay datos suficientes.</p>}
      </div>
    </>
  );
}
