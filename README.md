
# Backend de Ecommerce con Node.js

## Descripción del Proyecto

Este proyecto es un servidor backend para una plataforma de ecommerce construido utilizando Node.js, MongoDB y varias integraciones, como MercadoPago para pagos, Nodemailer para el manejo de correos electrónicos, y Cloudinary para la gestión de imágenes. El servidor gestiona el registro de usuarios, autenticación, control de acceso basado en roles, catálogo de productos y funcionalidades del carrito de compras, junto con características adicionales como la gestión de órdenes y notificaciones a través de correo electrónico y WhatsApp.

## Funcionalidades

1. **Gestión de Usuarios:**
   - Registro e inicio de sesión de usuarios
   - Hash de contraseñas con bcrypt
   - Recuperación de contraseña por correo electrónico (integración con Nodemailer)
   - Control de acceso basado en roles usando JWT
   - Middleware para autenticación y autorización de usuarios

2. **Gestión de Productos:**
   - CRUD completo (Crear, Leer, Actualizar, Eliminar) para el catálogo de productos
   - Gestión de imágenes a través de Cloudinary
   - 
3. **Gestión de Medicamentos:**
   - CRUD completo (Crear, Leer, Actualizar, Eliminar) para el catálogo de medicamentos

4. **Carrito de Compras y Órdenes:**
   - Agregar, actualizar y eliminar productos del carrito
   - Gestión y registro de órdenes en la base de datos
   - Envío de confirmaciones de órdenes por correo electrónico y WhatsApp

5. **Integración de Pagos:**
   - Integración de MercadoPago para la gestión de pagos

6. **Seguridad:**
   - Protección de rutas usando JWT
   - Middleware para control de acceso basado en roles

7. **Servicios Externos:**
   - Servicio de correos electrónicos con Nodemailer (por ejemplo, para recuperación de contraseñas)
   - Integración con la API de WhatsApp para notificaciones

## Tecnologías

- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
- **Express**: Framework web para Node.js.
- **MongoDB**: Base de datos NoSQL para almacenar datos de usuarios y productos.
- **Mongoose**: ODM para MongoDB que define esquemas y gestiona los datos.
- **JWT**: JSON Web Tokens para autenticación de usuarios y protección de rutas.
- **bcrypt**: Hashing de contraseñas para seguridad.
- **API de MercadoPago**: Procesamiento de pagos.
- **Nodemailer**: Envío de correos electrónicos para notificaciones de usuarios.
- **Cloudinary**: Servicio de gestión de imágenes.
- **API de WhatsApp**: Notificaciones de mensajes para los usuarios.

## Instalación

### Prerrequisitos
- Node.js y npm instalados
- Instancia de MongoDB (local o en la nube)
- Credenciales de MercadoPago, Cloudinary, API de WhatsApp y Nodemailer

### Pasos

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-repo/ecommerce-backend.git
  ```
2. Instala las dependencias:
  ```bash
    npm install
  ```
3. Configura las variables de entorno: Crea un archivo .env en el directorio raíz y añade tus credenciales:
 ``` bash
  MONGO_URI=tu_mongo_uri
  JWT_SECRET=tu_jwt_secret
  CLOUDINARY_URL=tu_cloudinary_url
  MERCADO_PAGO_ACCESS_TOKEN=tu_access_token
  NODEMAILER_USER=tu_correo_usuario
  NODEMAILER_PASS=tu_correo_contraseña
```
4. Ejecuta el servidor:
  bash
  npm start
5. Abre la API en tu navegador en http://localhost:3000

# Documentación de la API
La API está documentada utilizando [Swagger/Postman]. Puedes encontrar documentación detallada sobre todas las rutas disponibles, incluyendo ejemplos y formatos de solicitud/respuesta, visitando /api-docs (si estás usando Swagger).

# Despliegue
Este proyecto puede desplegarse en plataformas como Vercel, Heroku o cualquier otro servicio preferido. Asegúrate de actualizar tus variables de entorno en la configuración de la plataforma.

# Licencia
Este proyecto es de código abierto y está disponible bajo la Licencia MIT.


