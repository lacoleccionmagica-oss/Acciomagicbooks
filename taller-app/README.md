# Taller — App de gestión

App web para gestionar pedidos, clientes, productos/costos, materiales y finanzas
de tu emprendimiento. Hecha con **Next.js** (JavaScript) + **Supabase** (base de
datos y autenticación), pensada para alojarse en **Vercel**.

## 1. Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá un proyecto nuevo (elegí
   una contraseña para la base de datos y guardala).
2. En el panel del proyecto, abrí **SQL Editor** → **New query**, pegá todo el
   contenido del archivo [`supabase/schema.sql`](./supabase/schema.sql) y ejecutalo
   (botón "Run"). Esto crea las tablas `profiles`, `clientes`, `materiales`,
   `productos` y `pedidos`, con sus permisos (RLS).
3. En **Authentication → Providers**, dejá habilitado "Email". Si no querés que
   los nuevos usuarios tengan que confirmar el email (no es necesario, porque los
   usuarios los crea un admin desde la app), en **Authentication → Settings**
   podés desactivar "Confirm email".

### Crear tu primer usuario administrador

Como dar de alta usuarios es una función *dentro* de la app (solo para admins),
el primer usuario hay que crearlo a mano una sola vez:

1. Vení a **Authentication → Users → Add user**, ingresá tu email y una
   contraseña, y confirmá.
2. Volvé al **SQL Editor** y ejecutá (reemplazando el email):

   ```sql
   update public.profiles set role = 'admin' where email = 'tu-email@ejemplo.com';
   ```

3. Listo: con ese usuario vas a poder entrar a la app y crear el resto de los
   usuarios desde la sección "Usuarios".

### Obtener las claves del proyecto

En **Project Settings → API** vas a encontrar:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (¡secreta! nunca la subas
  al repositorio ni la pongas en código del navegador)

## 2. Probarlo en tu computadora (opcional)

```bash
npm install
cp .env.example .env.local
# completá .env.local con tus claves de Supabase
npm run dev
```

Abrí `http://localhost:3000` e iniciá sesión con el usuario admin que creaste.

## 3. Subir el código a GitHub

Si todavía no está en un repositorio:

```bash
git init
git add .
git commit -m "Primera versión de la app del taller"
```

Creá un repositorio en GitHub y subí el código (`git remote add origin ...`,
`git push -u origin main`).

## 4. Desplegar en Vercel

1. Entrá a [vercel.com](https://vercel.com), "Add New" → "Project" → importá tu
   repositorio de GitHub.
2. En "Environment Variables" agregá las tres variables del paso 1:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Hacé clic en "Deploy". En unos minutos vas a tener tu URL pública
   (algo como `https://taller-app.vercel.app`).

Cada vez que subas cambios a la rama principal, Vercel vuelve a desplegar
automáticamente.

## 5. Cómo usar la gestión de usuarios

- Entrá a **Usuarios** (solo visible para administradores).
- "+ Nuevo usuario": ingresá email, contraseña, nombre y rol (Empleado o
  Administrador). La persona ya puede iniciar sesión con esos datos.
- Podés cambiar el rol de cualquier usuario desde la tabla, o eliminarlo.
- Todos los usuarios ven y editan **los mismos datos** del taller (pedidos,
  clientes, productos, materiales): es un solo espacio de trabajo compartido.

## Estructura del proyecto

```
app/
  login/                 → pantalla de inicio de sesión
  (app)/                 → rutas protegidas (requieren sesión)
    panel/               → dashboard principal
    pedidos/             → módulo de pedidos
    clientes/            → módulo de clientes
    productos/           → catálogo y costos
    materiales/          → stock de materiales
    finanzas/            → resumen financiero
    usuarios/            → alta/gestión de usuarios (solo admin)
    proximamente/[..]    → módulos planificados (presupuestos, envíos, etc.)
  api/usuarios/          → endpoints para crear/eliminar usuarios (admin)
lib/
  supabase/              → clientes de Supabase (browser, server, admin)
  calc.js                → cálculos de costos, ganancias y alertas
  constants.js           → listas de opciones, navegación, etc.
components/              → UI compartida (modal, iconos, etc.)
supabase/schema.sql      → script para crear la base de datos
```

## Próximos módulos

Las secciones marcadas como "pronto" en el menú (Presupuestos automáticos,
Envíos, Cola de producción, Archivos y diseños, Reportes) todavía no están
implementadas — quedan como roadmap para próximas versiones.
