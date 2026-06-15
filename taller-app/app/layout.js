import './globals.css';

export const metadata = {
  title: 'Taller — Gestión',
  description: 'Gestión de pedidos, clientes, productos, costos y stock del taller.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
