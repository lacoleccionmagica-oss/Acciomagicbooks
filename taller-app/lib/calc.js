export function num(n) {
  return Number(n) || 0;
}

export function money(n) {
  n = Number(n) || 0;
  return '$' + n.toLocaleString('es-AR', { maximumFractionDigits: 0 });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function fmtDate(s) {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function daysFromToday(s) {
  if (!s) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(s + 'T00:00:00');
  return Math.round((d - today) / 86400000);
}

export function monthKey(s) {
  return s ? s.slice(0, 7) : '';
}

export function monthLabel(m) {
  const [y, mm] = m.split('-');
  const d = new Date(Number(y), Number(mm) - 1, 1);
  return d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
}

// p: producto con costo_material, costo_electrico, packaging, comisiones,
// publicidad, desgaste, mano_obra, margen_minimo, precio_venta
export function computeProducto(p) {
  const costoTotal =
    num(p.costo_material) +
    num(p.costo_electrico) +
    num(p.packaging) +
    num(p.comisiones) +
    num(p.publicidad) +
    num(p.desgaste) +
    num(p.mano_obra);
  const margenMin = num(p.margen_minimo);
  const precioMinimo = margenMin < 100 ? costoTotal / (1 - margenMin / 100) : costoTotal;
  const precioVenta = num(p.precio_venta);
  const gananciaNeta = precioVenta - costoTotal;
  const margen = precioVenta > 0 ? (gananciaNeta / precioVenta) * 100 : 0;
  return { costoTotal, precioMinimo, gananciaNeta, margen };
}

// ped: pedido con cantidad, costo_unitario, precio_unitario, sena
export function computePedido(ped) {
  const cantidad = num(ped.cantidad) || 1;
  const totalVenta = num(ped.precio_unitario) * cantidad;
  const costoTotal = num(ped.costo_unitario) * cantidad;
  const saldo = totalVenta - num(ped.sena);
  const ganancia = totalVenta - costoTotal;
  return { totalVenta, costoTotal, saldo, ganancia, cantidad };
}

// Alertas inteligentes a partir de los datos cargados
export function getAlerts({ pedidos, clientes, productos, materiales }) {
  const alerts = [];
  const byId = (arr, id) => arr.find((x) => x.id === id);

  pedidos.forEach((p) => {
    if (p.estado_entrega === 'Entregado' || p.estado_pago === 'Cancelado') return;
    const cliente = byId(clientes, p.cliente_id);
    const producto = byId(productos, p.producto_id);
    const nombreCliente = cliente ? cliente.nombre : 'Cliente';
    const nombreProd = producto ? producto.nombre : 'Producto';

    const d = daysFromToday(p.fecha_entrega);
    if (d !== null) {
      if (d < 0) {
        alerts.push({ level: 'danger', text: `Pedido de ${nombreCliente} (${nombreProd}) está atrasado — vencía el ${fmtDate(p.fecha_entrega)}.` });
      } else if (d === 0) {
        alerts.push({ level: 'warn', text: `Pedido de ${nombreCliente} (${nombreProd}) vence hoy.` });
      } else if (d <= 2) {
        alerts.push({ level: 'warn', text: `Pedido de ${nombreCliente} (${nombreProd}) vence en ${d} día(s) — ${fmtDate(p.fecha_entrega)}.` });
      }
    }

    const calc = computePedido(p);
    if (calc.saldo > 0 && (p.estado_pago === 'Señado' || p.estado_pago === 'Pagado parcial')) {
      alerts.push({ level: 'info', text: `${nombreCliente} todavía debe ${money(calc.saldo)} del pedido "${nombreProd}".` });
    }

    const dPedido = daysFromToday(p.fecha_pedido);
    if (p.estado_produccion !== 'Realizado' && dPedido !== null && dPedido <= -7) {
      alerts.push({ level: 'warn', text: `Hace ${Math.abs(dPedido)} días que el pedido de ${nombreCliente} (${nombreProd}) está en producción sin terminar.` });
    }
  });

  materiales.forEach((m) => {
    if (num(m.stock_actual) <= num(m.stock_minimo)) {
      const unidadTxt = m.unidad === 'unidad' ? 'u' : m.unidad;
      alerts.push({
        level: num(m.stock_actual) === 0 ? 'danger' : 'warn',
        text: `Te quedan ${m.stock_actual}${unidadTxt} de ${m.nombre} (mínimo recomendado: ${m.stock_minimo}${unidadTxt}).`,
      });
    }
  });

  productos.forEach((p) => {
    if (p.estado !== 'Activo') return;
    const c = computeProducto(p);
    if (c.margen < num(p.margen_minimo) && num(p.precio_venta) > 0) {
      alerts.push({ level: 'info', text: `"${p.nombre}" tiene un margen de ${c.margen.toFixed(0)}%, por debajo de tu mínimo (${p.margen_minimo}%).` });
    }
  });

  const order = { danger: 0, warn: 1, info: 2 };
  alerts.sort((a, b) => order[a.level] - order[b.level]);
  return alerts;
}
