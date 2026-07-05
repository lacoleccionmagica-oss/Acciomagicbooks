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
      { id: 'pedidos',      label: 'Pedidos',      href: '/pedidos',      icon: 'box'   },
      { id: 'presupuestos', label: 'Presupuestos', href: '/presupuestos', icon: 'doc'   },
      { id: 'envios',       label: 'Envíos',       href: '/envios',       icon: 'truck' },
    ],
  },
  {
    group: 'Producción',
    items: [
      { id: 'produccion', label: 'Cola de producción', href: '/produccion', icon: 'calendar' },
      { id: 'archivos',   label: 'Archivos y diseños', href: '/archivos',   icon: 'folder'   },
    ],
  },
  {
    group: 'Catálogo',
    items: [
      { id: 'productos',  label: 'Productos y costos', href: '/productos',  icon: 'layers' },
      { id: 'materiales', label: 'Materiales / stock', href: '/materiales', icon: 'cube'   },
    ],
  },
  {
    group: 'Personas y dinero',
    items: [
      { id: 'clientes', label: 'Clientes', href: '/clientes', icon: 'users'  },
      { id: 'finanzas', label: 'Finanzas', href: '/finanzas', icon: 'chart'  },
      { id: 'reportes', label: 'Reportes', href: '/reportes', icon: 'report' },
    ],
  },
];

export const ADMIN_NAV_ITEM = { id: 'usuarios', label: 'Usuarios', href: '/usuarios', icon: 'users' };

export const PLACEHOLDERS = {
  presupuestos: { title: 'Presupuestos automáticos', desc: '', items: [] },
  envios:       { title: 'Envíos',                   desc: '', items: [] },
  produccion:   { title: 'Cola de producción',        desc: '', items: [] },
  archivos:     { title: 'Archivos y diseños',        desc: '', items: [] },
  reportes:     { title: 'Reportes',                  desc: '', items: [] },
};
