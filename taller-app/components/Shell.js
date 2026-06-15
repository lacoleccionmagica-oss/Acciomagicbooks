'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { NAV, ADMIN_NAV_ITEM } from '@/lib/constants';
import Icon from './Icon';

export default function Shell({ profile, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const isAdmin = profile?.role === 'admin';
  const groups = isAdmin
    ? [...NAV, { group: 'Administración', items: [ADMIN_NAV_ITEM] }]
    : NAV;

  return (
    <div id="app">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">T</div>
          <div className="brand-text">
            <h1>Taller</h1>
            <span>Gestión del emprendimiento</span>
          </div>
        </div>
        <nav className="nav">
          {groups.map((group) => (
            <div key={group.group}>
              <div className="nav-group-label">{group.group}</div>
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`nav-item ${active ? 'active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                    {item.soon && <span className="soon">pronto</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <b>{profile?.full_name || profile?.email}</b>
            {profile?.role === 'admin' ? 'Administrador' : 'Empleado'}
          </div>
          <button className="nav-item" onClick={handleLogout}>
            <Icon name="logout" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="row" style={{ gap: 12 }}>
            <button className="mobile-toggle" onClick={() => setOpen(!open)}>
              <Icon name="menu" size={15} /> Menú
            </button>
            <h2>{titleFor(pathname, groups)}</h2>
          </div>
          <div className="date mono">{todayLabel()}</div>
        </div>
        <div className="view">{children}</div>
      </div>
    </div>
  );
}

function titleFor(pathname, groups) {
  for (const group of groups) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) return item.label;
    }
  }
  return 'Panel principal';
}

function todayLabel() {
  return new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
