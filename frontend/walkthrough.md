# Walkthrough: Refactorización a MVP Profesional

Se ha transformado la aplicación en un MVP profesional con una arquitectura escalable, lógica de negocio avanzada y una interfaz moderna.

## 1. Nueva Arquitectura
La estructura del proyecto se ha reorganizado para seguir las mejores prácticas:

- **`/src/context`**: `FleetContext.jsx` maneja el estado global de vehículos, rutas, conductores y tema (Dark Mode).
- **`/src/layout`**: `MainLayout` y `Sidebar` proporcionan una navegación consistente y adaptable.
- **`/src/pages`**: Vistas separadas para `Dashboard`, `Vehiculos`, `Rutas`, etc.
- **`/src/components`**: Componentes reutilizables y específicos de negocio.

## 2. Funcionalidades de Negocio Implementadas

### A. Flota Inteligente
- **Alerta de Mantenimiento**: En la tarjeta del vehículo, si `(proxima_revision - kilometros) < 1000`, aparece una alerta visual amarilla.
- **Asignación de Conductores**:
  - Se visualiza el conductor asignado en la tarjeta.
  - En el formulario (ahora un **Drawer** lateral), se puede seleccionar un conductor.
  - **Validación**: No permite asignar conductores con carnet caducado o que ya estén ocupados en otro vehículo.
- **Gestión de Estados**: Los vehículos en "Taller" se marcan visualmente en rojo.

### B. Rutas y Mapas
- **Integración Leaflet**: En la tarjeta de ruta, el botón "Ver Mapa" abre un modal con un mapa interactivo mostrando el trayecto (polilínea entre origen y destino).
- **Cálculo de Costes**: Se calcula y muestra el coste estimado del viaje basado en distancia, consumo y precio de gasolina.

### C. Dashboard Analítico
- **Gráficos Reales**: Se han implementado gráficos con `recharts`:
  - Barras: Gastos mensuales de combustible.
  - Circular (Pie): Estado actual de la flota.
- **KPIs**: Tarjetas de resumen con métricas clave en tiempo real.

## 3. Mejoras UI/UX
- **Dark Mode**: Toggle en la cabecera que cambia instantáneamente toda la paleta de colores.
- **Diseño Drawer**: El formulario de creación de vehículos ya no es un modal intrusivo, sino un panel lateral elegante.
- **Filtros**: En la página de vehículos, se puede filtrar por estado y buscar por texto simultáneamente.

## Verificación Manual
1. **Navegación**: Usa el Sidebar para moverte entre Dashboard, Vehículos y Rutas.
2. **Dark Mode**: Pulsa el botón en la cabecera y verifica que todos los componentes se adaptan.
3. **Mapa**: Ve a "Rutas" y pulsa "Ver Mapa". Debería aparecer el mapa con la ruta dibujada.
4. **Alerta Mantenimiento**: Observa el vehículo "Volvo FH16" (ID 1), tiene una alerta de revisión.
5. **Nuevo Vehículo**:
   - Ve a "Vehículos" -> "+ Añadir Vehículo".
   - Prueba a asignar un conductor.
   - Verifica que el panel lateral se abre y cierra suavemente.

## Archivos Clave
- `src/context/FleetContext.jsx`
- `src/layout/MainLayout.jsx`
- `src/components/MapaRuta.jsx`
- `src/components/Estadisticas.jsx`
