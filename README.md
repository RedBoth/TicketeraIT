# 🛠️ Enterprise Ticketera — Multi-tenant ITSM Platform

Plataforma corporativa de gestión de tickets de soporte técnico e infraestructura IT (**ITSM**), diseñada bajo una arquitectura **Multi-tenant**. Permite a empresas clientes administrar sus incidencias e inventarios, mientras brinda a los técnicos una consola centralizada de torre de control para soporte y auditoría en tiempo real.

---

## 🚀 Características Principales

### 🏢 Gestión Multi-tenant & Branding
* **Aislamiento de Entornos:** Organización y segmentación de datos aislados por compañía (`/[tenantSlug]`).
* **Personalización Dinámica:** Ajuste de nombre comercial y paleta cromática (color primario y de acento) por tenant.
* **Control Center Global:** Módulo unificado (`/admin`) para técnicos con métricas consolidadas y gestión de empresas.

### 🎫 Gestión de Incidencias & SLA
* **Ciclo de Vida de Tickets:** Estados adaptativos (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) y priorización visual.
* **Asignación de Hardware:** Vinculación directa de equipos del inventario a la solicitud reportada.
* **Imputación de Horas & Historial:** Registro detallado de intervenciones técnicas con cómputo de horas de soporte.

### 💻 Inventario de Infraestructura
* **Trazabilidad de Hardware:** Registro de Laptops, Servidores e Impresoras.
* **Identificación Unívoca:** Captura de Números de Serie y Direcciones MAC para auditorías de red.
* **Contador de Casos Activos:** Vista rápida de criticidad por equipo en tiempo real.

### 🔐 Seguridad & Usuarios
* **Control de Acceso basado en Roles (RBAC):** Roles de `SUPER_ADMIN`, `TECNICO` y `CLIENTE_FINAL`.
* **Provisión de Cuentas:** Alta y edición manual de empleados por parte del técnico con enmascaramiento y revelación de contraseñas.
* **Autenticación HTTP-Only:** Sesiones seguras persistidas vía cookies.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, Server Actions)
* **Lenguaje:** TypeScript
* **Base de Datos & ORM:** PostgreSQL + Prisma ORM
* **Estilos & UI:** Tailwind CSS + Lucide Icons
* **Autenticación Custom:** Cookies HTTP-Only + Middleware de protección de rutas

---

## 📂 Estructura del Proyecto

```text
src/
├── actions/             # Server Actions (auth, tickets, tenant, users, inventory)
├── app/                 # Rutas de App Router (Next.js)
│   ├── [tenantSlug]/    # Entorno privado por cliente (dashboard, tickets, inventory, users, settings)
│   ├── admin/           # Consola de Control Center para Técnicos
│   ├── login/           # Pantalla de acceso pública
│   └── page.tsx         # Redirección inteligente basada en sesión
├── components/          # Componentes de UI (Sidebar, Header, Modales, Badges, Tablas)
├── lib/                 # Configuración de Prisma client y utilidades de auth
└── services/            # Capa de servicios para lógica de negocio
```

---

## Instalación y configuración local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/RedBoth/TicketeraIT
    cd TicketeraIT
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` basado en el `.env.example` y configura tus claves (API Keys, DB, etc.).
    ```bash
    DATABASE_URL="postgresql://usuario:password@localhost:5432/ticketera_db?schema=public"
    ```

4.  **Ejecutar migraciones de Prisma:**
    ```bash
    npx prisma db push
    npx prisma generate
    ```

5.  **Ejecutar la aplicación:**
    ```bash
    npm run dev
    ```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si deseas mejorar Campo-app:

1.  Haz un Fork del proyecto.
2.  Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3.  Haz Commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4.  Haz Push a la rama (`git push origin feature/nueva-funcionalidad`).
5.  Abre un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE.md](LICENSE) para más detalles.
