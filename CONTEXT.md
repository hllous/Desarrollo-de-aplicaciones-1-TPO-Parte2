# CONTEXT.md

## Glosario del dominio

### Producto
Entidad central del sistema. Representa un ítem de inventario con los campos: `id`, `nombre`, `descripcion`, `precio`, `cantidad`. Es la única entidad sujeta a operaciones CRUD.

### Fuente de datos
El origen desde el cual se leen y escriben los Productos. Puede ser **Remota** (API) o **Local** (SQLite). El usuario selecciona la fuente activa mediante un toggle en la pantalla de Productos.

### Fuente Remota
Conexión HTTP a mockapi.io usando axios. Endpoint base: `https://6a2bed063e2b60ab038f0b78.mockapi.io/productos`.

### Fuente Local
Base de datos SQLite embebida en el dispositivo, gestionada con expo-sqlite.

### Pantalla Home
Pantalla inicial de la app. Muestra el nombre "Gestor de Stock", una imagen representativa, y la leyenda "TPO Parte 2".

### Pantalla Productos
Pantalla principal de CRUD. Permite listar, crear, editar y eliminar Productos. Incluye un toggle para cambiar entre Fuente Remota y Fuente Local.

### Pantalla Acerca De
Muestra nombre y foto de cada integrante del equipo. Las fotos son assets locales (placeholders hasta tener las imágenes reales).

### Integrantes
- Nicolas Facundo Llousas (LU: 1147795)
- Sebastian Andres Deya (LU: 1167157)
- Valentina Frisoli (LU: 1167852)
- Ignacio Sanchez Zinny (LU: 1167840)
- Ignacio Bergallo (LU: 1173481)
- Francisco Garriga (LU: 1168942)
