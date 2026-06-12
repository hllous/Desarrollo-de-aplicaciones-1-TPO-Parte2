---
label: ready-for-agent
---

# PRD: Gestor de Stock — TPO Parte 2

## Problem Statement

El equipo necesita entregar un TPO que demuestre el uso de React Native con Expo para construir una app mobile/web con operaciones CRUD, navegación entre pantallas, conexión a un backend HTTP remoto, y acceso a una base de datos local — todo en un único proyecto funcional.

## Solution

Una app "Gestor de Stock" construida con Expo que permite gestionar Productos (listar, crear, editar, eliminar) con dos fuentes de datos intercambiables: una Fuente Remota (mockapi.io via axios) y una Fuente Local (expo-sqlite). La navegación se realiza mediante un drawer lateral con tres pantallas: Home, Productos y Acerca De.

## User Stories

1. Como usuario, quiero ver una pantalla de inicio con el nombre "Gestor de Stock" y la leyenda "TPO Parte 2", para saber qué app estoy usando.
2. Como usuario, quiero abrir un menú lateral (drawer), para navegar entre las secciones de la app.
3. Como usuario, quiero navegar a la pantalla de Productos desde el drawer, para gestionar el inventario.
4. Como usuario, quiero navegar a la pantalla Acerca De desde el drawer, para ver quiénes desarrollaron la app.
5. Como usuario, quiero ver la lista de todos los Productos en la pantalla de Productos, para conocer el inventario actual.
6. Como usuario, quiero ver el nombre, descripción, precio y cantidad de cada Producto en la lista, para tener información completa.
7. Como usuario, quiero crear un nuevo Producto completando un formulario con nombre, descripción, precio y cantidad, para agregar ítems al inventario.
8. Como usuario, quiero editar un Producto existente, para corregir o actualizar su información.
9. Como usuario, quiero eliminar un Producto, para removerlo del inventario.
10. Como usuario, quiero ver una confirmación antes de eliminar un Producto, para evitar borrados accidentales.
11. Como usuario, quiero alternar entre Fuente Remota y Fuente Local mediante un toggle en la pantalla de Productos, para elegir desde dónde se leen y escriben los datos.
12. Como usuario, quiero que al activar la Fuente Remota los datos se obtengan de mockapi.io via HTTP, para demostrar la integración con un backend externo.
13. Como usuario, quiero que al activar la Fuente Local los datos se lean y escriban en SQLite embebido, para operar sin conexión a internet.
14. Como usuario, quiero que el toggle indique claramente cuál fuente está activa (Remota / Local), para no confundirme sobre el origen de los datos.
15. Como usuario, quiero ver un indicador de carga mientras se obtienen datos, para saber que la app está trabajando.
16. Como usuario, quiero ver un mensaje de error si falla la comunicación con la Fuente Remota, para entender qué salió mal.
17. Como usuario, quiero ver los nombres y fotos de los 6 integrantes del equipo en la pantalla Acerca De, para conocer a los desarrolladores.

## Implementation Decisions

- **Framework:** Expo con `npx create-expo-app`. Target: mobile (iOS/Android) y web via `react-native-web`.
- **Navegación:** `@react-navigation/native` con `@react-navigation/drawer` — 3 entradas: Home, Productos, Acerca De.
- **Entidad Producto:** campos `id`, `nombre`, `descripcion`, `precio` (number), `cantidad` (number). El `id` es generado por la fuente de datos (mockapi asigna string UUID; SQLite usa INTEGER autoincrement).
- **Fuente Remota:** axios contra `https://6a2bed063e2b60ab038f0b78.mockapi.io/productos`. Resource `productos` a crear en mockapi.io antes de la implementación.
- **Fuente Local:** expo-sqlite con una tabla `productos` de esquema equivalente al modelo de Producto.
- **Toggle de fuente:** estado local en la pantalla Productos. Al cambiar la fuente, se recarga la lista desde la nueva fuente. No hay sincronización entre fuentes.
- **Capa de servicio:** dos módulos paralelos — `ProductoApiService` (axios) y `ProductoLocalService` (SQLite) — con la misma interfaz: `getAll`, `create`, `update`, `delete`. La pantalla Productos consume uno u otro según el toggle.
- **Pantalla Acerca De:** datos de los 6 integrantes hardcodeados. Fotos como assets locales (placeholders hasta disponer de imágenes reales).
- **Pantalla Home:** imagen decorativa como asset local, texto estático.
- **Tema visual:** claro, colores neutros (blanco/gris) con acento azul.

## Testing Decisions

- **Stack de tests:** Jest + React Testing Library (via `@testing-library/react-native`).
- **Qué se testea:** comportamiento observable desde afuera del módulo — no implementación interna.
- **Módulos a testear:**
  - `ProductoApiService`: mockear axios y verificar que `getAll`, `create`, `update`, `delete` llamen a los endpoints correctos con los parámetros esperados.
  - `ProductoLocalService`: mockear expo-sqlite y verificar que las queries SQL sean correctas.
  - Componente formulario de Producto: verificar que el submit emite los valores correctos y que la validación bloquea campos vacíos.
- **Tests de componente:** usar `render` + `fireEvent` de `@testing-library/react-native`. No testear detalles de estilo ni estructura interna del componente.
- **Criterio de suficiencia:** al menos un test por operación CRUD en cada servicio, y un test del formulario para el caso feliz y el caso de validación fallida.

## Out of Scope

- Autenticación / login de usuarios.
- Sincronización entre Fuente Remota y Fuente Local.
- Categorías, proveedores, o cualquier entidad distinta a Producto.
- Historial de movimientos de stock.
- Búsqueda o filtrado de Productos.
- Paginación.
- Notificaciones push.

## Further Notes

- El resource `productos` en mockapi.io debe crearse manualmente antes de ejecutar la app con Fuente Remota activa.
- Las fotos de integrantes en Acerca De son placeholders — reemplazar con imágenes reales antes de la entrega final.
- El proyecto debe poder ejecutarse con `npx expo start` y correr tanto en emulador mobile como en browser (`w` en Expo CLI).
