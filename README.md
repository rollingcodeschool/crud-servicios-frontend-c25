# 💻 CRUD de Servicios de programación

Este proyecto es una aplicación web desarrollada con React y TypeScript que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre un listado de servicios. Incluye además un carrito de compras, checkout con Mercado Pago y sesión de administrador gestionada con cookie httpOnly. Es ideal para aprender y practicar conceptos de desarrollo frontend moderno.

## 🦖 Demo

mira la demo del proyecto [aqui](https://crud-servicios-frontend-c25.netlify.app/)

## 🚀 Librerías utilizadas

- React 19
- TypeScript
- Vite 8
- React Router 8
- Tailwind CSS 4
- react-hook-form
- react-icons
- sweetalert 2

## 📦 Pasos para usar el proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/rollingcodeschool/crud-servicios-frontend-c25
   ```
2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```
3. **Crear la variable de entorno:**
   - Crea un archivo llamado `.env` en la raíz del proyecto.
   - Agrega la siguiente línea (ajusta el valor según corresponda):
     ```bash
     VITE_SERVICIOS=url-api
     ```
   > `VITE_SERVICIOS` es la URL base de la API de servicios (login, carrito, órdenes y CRUD).
4. **Iniciar el proyecto:**
   ```bash
   pnpm run dev
   ```

## 📂 Estructura de carpetas

```
├── public/
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── assets/
│   ├── components/
│   │   ├── pages/
│   │   │   ├── Administrador.tsx
│   │   │   ├── Carrito.tsx
│   │   │   ├── DetalleServicio.tsx
│   │   │   ├── Error404.tsx
│   │   │   ├── FormularioServicio.tsx
│   │   │   ├── Inicio.tsx
│   │   │   ├── Login.tsx
│   │   │   └── ResultadoPago.tsx
│   │   ├── routes/
│   │   │   └── ProtectorRutas.tsx
│   │   ├── services/
│   │   │   ├── CardServicio.tsx
│   │   │   └── ItemTabla.tsx
│   │   └── shared/
│   │       ├── Footer.tsx
│   │       ├── Menu.tsx
│   │       └── Paginacion.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── helpers/
│   │   └── queries.ts
│   ├── interfaces/
│   │   ├── carrito.ts
│   │   ├── ordenes.ts
│   │   ├── servicios.ts
│   │   └── usuarios.ts
│   └── utils/
│       └── formateador.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 👩🏻‍💻 Autor

Hecho con 💜 por [Emilse Arias](https://github.com/emiarias)