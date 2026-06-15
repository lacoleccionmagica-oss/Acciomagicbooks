'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { money, fmtDate, todayISO, monthKey, computePedido, getAlerts } from '@/lib/calc';

export default function PanelPage() {
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [materiales, setMateriales] = useState([]);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [p, c, pr, m] = await Promise.all([
        supabase.from('pedidos').select('*'),
        supabase.from('clientes').select('*'),
        supabase.from('productos').select('*'),
        supabase.from('materiales').select('*'),
      ]);
      setPedidos(p.data || []);
      setClientes(c.data || []);
      setProductos(pr.data || []);
      setMateriales(m.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="muted">Cargando...</p>;

  if (pedidos.length === 0 && productos.length === 0 && materiales.length === 0) {
    return (
      <div className="empty-state">
        <h3>Todavía no hay datos cargados</h3>
        <p>Empezá agregando tus productos y materiales, y después cargá tu primer pedido.</p>
        <Link href="/productos" className="btn btn-primary">Empezar por Productos</Link>
      </div>
    );
  }

  const byId = (arr, id) => arr.find((x) => x.id === id);

  const pendientes = pedidos.filter((p) => p.estado_produccion === 'Pendiente').length;
  const paraEnviar = pedidos.filter((p) => p.estado_entrega === 'Pendiente de envío').length;
  const senados = pedidos.filter((p) => p.estado_pago === 'Señado').length;

  let porCobrar = 0;
  pedidos.forEach((p) => {
    if (p.estado_pago === 'Pagado completo' || p.estado_pago === 'Cancelado') return;
    porCobrar += computePedido(p).saldo;
  });

  const thisMonth = todayISO().slice(0, 7);
  let gananciaMes = 0;
  pedidos.forEach((p) => {
    if (monthKey(p.fecha_pedido) === thisMonth && p.estado_pago !== 'Cancelado') {
      gananciaMes += computePedido(p).ganancia;
    }
  });

  const materialesBajos = materiales.filter((m) => Number(m.stock_actual) <= Number(m.stock_minimo));

  const proximas = pedidos
    .filter((p) => p.estado_entrega !== 'Entregado' && p.estado_pago !== 'Cancelado' && p.fecha_entrega)
    .sort((a, b) => a.fecha_entrega.localeCompare(b.fecha_entrega))
    .slice(0, 5);

  const ventasPorProducto = {};
  pedidos.forEach((p) => {
    if (p.estado_pago === 'Cancelado') return;
    ventasPorProducto[p.producto_id] = (ventasPorProducto[p.producto_id] || 0) + (Number(p.cantidad) || 0);
  });
  const masVendidos = Object.entries(ventasPorProducto)
    .map(([id, cant]) => ({ producto: byId(productos, id), cant }))
    .filter((x) => x.producto)
    .sort((a, b) => b.cant - a.cant)
    .slice(0, 5);

  const alerts = getAlerts({ pedidos, clientes, productos, materiales });

  return (
    <>
      <div className="cards">
        <div className="card accent">
          <div className="kpi-label">Pedidos pendientes</div>
          <div className="kpi-value">{pendientes}</div>
          <div className="kpi-sub">en estado &quot;Pendiente&quot;</div>
        </div>
        <div className="card">
          <div className="kpi-label">Para enviar</div>
          <div className="kpi-value">{paraEnviar}</div>
          <div className="kpi-sub">pendientes de envío</div>
        </div>
        <div className="card warn">
          <div className="kpi-label">Por cobrar</div>
          <div className="kpi-value">{money(porCobrar)}</div>
          <div className="kpi-sub">saldos pendientes</div>
        </div>
        <div className="card">
          <div className="kpi-label">Pedidos señados</div>
          <div className="kpi-value">{senados}</div>
          <div className="kpi-sub">esperando saldo final</div>
        </div>
        <div className="card accent">
          <div className="kpi-label">Ganancia estimada del mes</div>
          <div className="kpi-value">{money(gananciaMes)}</div>
          <div className="kpi-sub">según pedidos cargados este mes</div>
        </div>
        <div className={`card ${materialesBajos.length ? 'warn' : ''}`}>
          <div className="kpi-label">Materiales por agotarse</div>
          <div className="kpi-value">{materialesBajos.length}</div>
          <div className="kpi-sub">{materialesBajos.length ? materialesBajos.map((m) => m.nombre).join(', ') : 'todo en orden'}</div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="box">
          <h3>Alertas inteligentes</h3>
          {alerts.length ? alerts.map((a, i) => (
            <div className={`alert alert-${a.level}`} key={i}>
              <span className="dot"></span><span>{a.text}</span>
            </div>
          )) : <p className="muted" style={{ fontSize: 13 }}>No hay alertas por ahora. 🎉</p>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="box">
            <h3>Próximas entregas</h3>
            {proximas.length ? (
              <ul>
                {proximas.map((p) => {
                  const c = byId(clientes, p.cliente_id);
                  const pr = byId(productos, p.producto_id);
                  return (
                    <li key={p.id}>
                      <span>{c ? c.nombre : 'Cliente'} — {pr ? pr.nombre : 'Producto'}</span>
                      <span className="mono">{fmtDate(p.fecha_entrega)}</span>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="muted" style={{ fontSize: 13 }}>No hay entregas próximas.</p>}
          </div>
          <div className="box">
            <h3>Productos más vendidos</h3>
            {masVendidos.length ? (
              <ul>
                {masVendidos.map((x) => (
                  <li key={x.producto.id}>
                    <span>{x.producto.nombre}</span>
                    <span className="mono">{x.cant} ud.</span>
                  </li>
                ))}
              </ul>
            ) : <p className="muted" style={{ fontSize: 13 }}>Todavía no hay ventas registradas.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
