-- =========================================================
-- ESQUEMA PARA "TALLER" — ejecutar en el SQL Editor de Supabase
-- =========================================================

-- ---------------------------------------------------------
-- 1. PERFILES DE USUARIO (vinculados a auth.users)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'empleado' check (role in ('admin', 'empleado')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Cualquier usuario autenticado puede ver la lista de perfiles
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- Solo un admin puede actualizar perfiles (por ejemplo, cambiar el rol)
create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Solo un admin puede borrar perfiles
create policy "profiles_delete_admin"
  on public.profiles for delete
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Función + trigger: cuando se crea un usuario en auth.users,
-- se crea automáticamente su fila en profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'empleado')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ---------------------------------------------------------
-- 2. CLIENTES
-- ---------------------------------------------------------
create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  instagram text,
  direccion text,
  preferencias text,
  notas text,
  created_at timestamptz default now()
);

alter table public.clientes enable row level security;

create policy "clientes_all_authenticated"
  on public.clientes for all
  to authenticated
  using (true)
  with check (true);


-- ---------------------------------------------------------
-- 3. MATERIALES / STOCK
-- ---------------------------------------------------------
create table if not exists public.materiales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text,
  unidad text default 'g',
  stock_actual numeric default 0,
  stock_minimo numeric default 0,
  costo_unidad numeric default 0,
  proveedor text,
  ultima_compra date,
  precio_compra_anterior numeric default 0,
  created_at timestamptz default now()
);

alter table public.materiales enable row level security;

create policy "materiales_all_authenticated"
  on public.materiales for all
  to authenticated
  using (true)
  with check (true);


-- ---------------------------------------------------------
-- 4. PRODUCTOS Y COSTOS
-- ---------------------------------------------------------
create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text,
  estado text default 'Activo',
  canales text[] default '{}',
  stock numeric default 0,
  tiempo_produccion numeric default 0,
  costo_material numeric default 0,
  gramos numeric default 0,
  horas_impresion numeric default 0,
  costo_electrico numeric default 0,
  packaging numeric default 0,
  comisiones numeric default 0,
  publicidad numeric default 0,
  desgaste numeric default 0,
  mano_obra numeric default 0,
  margen_minimo numeric default 30,
  precio_venta numeric default 0,
  notas text,
  created_at timestamptz default now()
);

alter table public.productos enable row level security;

create policy "productos_all_authenticated"
  on public.productos for all
  to authenticated
  using (true)
  with check (true);


-- ---------------------------------------------------------
-- 5. PEDIDOS
-- ---------------------------------------------------------
create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes (id) on delete set null,
  producto_id uuid references public.productos (id) on delete set null,
  cantidad numeric default 1,
  fecha_pedido date,
  fecha_entrega date,
  estado_produccion text default 'Pendiente',
  estado_entrega text default 'Pendiente',
  estado_pago text default 'Por pagar',
  medio_pago text,
  canal_venta text,
  sena numeric default 0,
  costo_unitario numeric default 0,
  precio_unitario numeric default 0,
  notas text,
  created_at timestamptz default now()
);

alter table public.pedidos enable row level security;

create policy "pedidos_all_authenticated"
  on public.pedidos for all
  to authenticated
  using (true)
  with check (true);


-- ---------------------------------------------------------
-- 6. PRIMER USUARIO ADMINISTRADOR
-- ---------------------------------------------------------
-- 1) Creá un usuario desde Authentication -> Users -> Add user
--    en el panel de Supabase (con email y contraseña).
-- 2) Después ejecutá esto, reemplazando el email, para que sea admin:
--
-- update public.profiles set role = 'admin' where email = 'tu-email@ejemplo.com';
