# AGENTS.md

Guía para agentes de IA que trabajan en este repositorio.

## 📋 Descripción del proyecto

CRUD de servicios de programación: aplicación web (Crear, Leer, Actualizar, Eliminar) sobre un listado de servicios, con login de administrador y rutas protegidas.

## 🛠️ Stack

- **React 19** + **TypeScript**
- **Vite 8** como bundler
- **Tailwind CSS 4** (vía plugin `@tailwindcss/vite`)
- **React Router 8** para el enrutado
- **react-hook-form** para formularios
- **sweetalert2** para alertas/dialogos
- **react-icons** para iconos
- Gestor de paquetes: **pnpm**

## 🚀 Comandos

```bash
pnpm install        # instalar dependencias
pnpm run dev        # servidor de desarrollo
pnpm run build      # build de producción (tsc -b && vite build)
pnpm run lint       # lint con ESLint
pnpm run preview    # previsualizar el build
```

## 🔐 Variables de entorno

Crear un archivo `.env` en la raíz (no está versionado):

```bash
VITE_EMAIL=email-admin        # credencial para el login del administrador
VITE_PASSWORD=password-admin  # credencial para el login del administrador
VITE_SERVICIOS=url-api        # URL base de la API de servicios
```

Se acceden con `import.meta.env.VITE_*` (ver `src/helpers/queries.ts`).

## 📂 Estructura de carpetas

```
├── public/
├── src/
│   ├── App.tsx                     # Rutas principales de la app
│   ├── main.tsx                    # Punto de entrada
│   ├── index.css                   # Estilos globales (Tailwind)
│   ├── components/
│   │   ├── pages/                  # Vistas: Inicio, Login, Administrador,
│   │   │                           # DetalleServicio, FormularioServicio, Error404
│   │   ├── routes/ProtectorRutas.tsx   # Guard de rutas privadas
│   │   ├── services/               # CardServicio, ItemTabla (UI de servicios)
│   │   └── shared/                 # Menu, Footer (layout compartido)
│   ├── context/AppContext.tsx      # Contexto global (estado de la app)
│   ├── helpers/queries.ts          # Llamadas fetch a la API (CRUD)
│   ├── interfaces/servicios.ts     # Tipado del modelo Servicio
│   └── utils/formateador.ts        # Utilidades de formato
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧑‍💻 Convenciones de código

- **Idioma:** nombres, funciones y comentarios en español.
- **Componentes:** archivos `.tsx` en PascalCase (ej. `DetalleServicio.tsx`).
- **Helpers y utilidades:** archivos `.ts` con funciones exportadas en camelCase en español (ej. `listarServicios`, `crearServicio`).
- **Modelos:** interfaces TypeScript en `src/interfaces/` (ej. `Servicio`).
- **Llamadas a la API:** centralizadas en `src/helpers/queries.ts` usando `fetch` con `try/catch` y `console.error`.
- **Estado global:** usar `AppContext` para datos compartidos entre páginas.
- **Estilos:** clases utilitarias de Tailwind directamente en el JSX.
- **Formularios:** usar `react-hook-form`.
- **Alertas:** usar `sweetalert2`.

## ✅ Antes de terminar una tarea

1. `pnpm run lint` sin errores.
2. `pnpm run build` compila sin errores de TypeScript.
3. Verificar que las vistas afectadas funcionan en `pnpm run dev`.
