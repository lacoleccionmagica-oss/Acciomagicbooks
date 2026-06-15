export const OPTIONS = {
  estadoProduccion: ['Pendiente', 'En diseño', 'En impresión', 'En armado', 'Listo', 'Realizado'],
  estadoEntrega: ['Pendiente', 'Pendiente de envío', 'Enviado', 'Entregado', 'Retira por punto acordado'],
  estadoPago: ['Por pagar', 'Señado', 'Pagado parcial', 'Pagado completo', 'Cancelado'],
  medioPago: ['Efectivo', 'Transferencia', 'Mercado Pago', 'Tarjeta', 'Otro'],
  canalVenta: ['Instagram', 'Marketplace', 'Mercado Libre', 'WhatsApp', 'Feria', 'Otro'],
  categoriaProducto: ['Impresión 3D', 'Booknooks', 'Libros', 'Cajas porta figuritas', 'Llaveros', 'Otro'],
  estadoProducto: ['Activo', 'Pausado', 'Agotado'],
  canalesPublicacion: ['Instagram', 'Mercado Libre', 'Marketplace', 'Tienda Nube', 'WhatsApp', 'Feria'],
  categoriaMaterial: ['Filamento', 'Insumo de armado', 'Packaging', 'Producto terminado', 'Otro'],
  unidadMaterial: ['g', 'kg', 'unidad', 'm', 'l', 'par'],
};

export const STATUS_CLASS = {
  Pendiente: 'tag-pending',
  'En diseño': 'tag-progress',
  'En impresión': 'tag-progress',
  'En armado': 'tag-progress',
  Listo: 'tag-progress',
  Realizado: 'tag-ok',
  'Pendiente de envío': 'tag-pending',
  Enviado: 'tag-progress',
  Entregado: 'tag-ok',
  'Retira por punto acordado': 'tag-progress',
  'Por pagar': 'tag-pending',
  Señado: 'tag-warn',
  'Pagado parcial': 'tag-progress',
  'Pagado completo': 'tag-ok',
  Cancelado: 'tag-danger',
  Activo: 'tag-ok',
  Pausado: 'tag-pending',
  Agotado: 'tag-danger',
};

export const NAV = [
  {
    group: 'General',
    items: [{ id: 'panel', label: 'Panel principal', href: '/panel', icon: 'home' }],
  },
  {
    group: 'Ventas',
    items: [
      { id: 'pedidos', label: 'Pedidos', href: '/pedidos', icon: 'box' },
      { id: 'presupuestos', label: 'Presupuestos', href: '/proximamente/presupuestos', icon: 'doc', soon: true },
      { id: 'envios', label: 'Envíos', href: '/proximamente/envios', icon: 'truck', soon: true },
    ],
  },
  {
    group: 'Producción',
    items: [
      { id: 'produccion', label: 'Cola de producción', href: '/proximamente/produccion', icon: 'calendar', soon: true },
      { id: 'archivos', label: 'Archivos y diseños', href: '/proximamente/archivos', icon: 'folder', soon: true },
    ],
  },
  {
    group: 'Catálogo',
    items: [
      { id: 'productos', label: 'Productos y costos', href: '/productos', icon: 'layers' },
      { id: 'materiales', label: 'Materiales / stock', href: '/materiales', icon: 'cube' },
    ],
  },
  {
    group: 'Personas y dinero',
    items: [
      { id: 'clientes', label: 'Clientes', href: '/clientes', icon: 'users' },
      { id: 'finanzas', label: 'Finanzas', href: '/finanzas', icon: 'chart' },
      { id: 'reportes', label: 'Reportes', href: '/proximamente/reportes', icon: 'report', soon: true },
    ],
  },
];

// Solo visible para admins
export const ADMIN_NAV_ITEM = { id: 'usuarios', label: 'Usuarios', href: '/usuarios', icon: 'users' };

export const PLACEHOLDERS = {
  presupuestos: {
    title: 'Presupuestos automáticos',
    desc: 'Vas a poder armar un presupuesto eligiendo producto, cantidad, personalización, packaging, envío y descuento — y la app va a calcular el costo, el precio recomendado, la ganancia y un mensaje listo para enviarle al cliente.',
    items: [
      'Selector de producto y cantidad',
      'Personalización y extras',
      'Cálculo automático de envío y descuentos',
      'Mensaje pre-armado para WhatsApp / Instagram',
    ],
  },
  envios: {
    title: 'Envíos',
    desc: 'Un módulo para controlar cada entrega: dirección, medio de envío, costo, quién lo paga, código de seguimiento, comprobante y estado.',
    items: [
      'Estados: sin preparar, empaquetado, despachado, entregado, reclamo',
      'Carga de comprobante y foto del paquete',
      'Código de seguimiento por pedido',
    ],
  },
  produccion: {
    title: 'Cola de producción y calendario',
    desc: 'Vista de qué imprimir hoy, qué pedido vence primero, tiempo estimado, máquina asignada, material necesario y prioridad.',
    items: [
      'Cola ordenada por fecha de entrega y prioridad',
      'Vinculado a Pedidos y Materiales',
      'Vista de calendario semanal',
    ],
  },
  archivos: {
    title: 'Archivos y diseños',
    desc: 'Repositorio de archivos STL/3MF, fotos del producto, configuración usada, tiempo de impresión, material recomendado y versión del diseño.',
    items: [
      'Ficha por diseño con notas de impresión',
      'Historial de versiones',
      'Problemas detectados y soluciones',
    ],
  },
  reportes: {
    title: 'Reportes',
    desc: 'Reportes listos: producto más vendido, canal que más vende, clientes que más compraron, tiempo promedio de entrega y más.',
    items: [
      'Producto y canal más rentable',
      'Clientes top',
      'Tiempo promedio de entrega',
      'Pedidos cancelados',
    ],
  },
};
