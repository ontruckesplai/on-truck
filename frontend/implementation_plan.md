# Implementation Plan - Professional MVP Refactor

## Goal
Transform the current prototype into a scalable, professional MVP with advanced business logic, new architecture, and improved UI/UX (including Dark Mode).

## User Review Required
> [!IMPORTANT]
> This refactor introduces a new folder structure and significant changes to `App.jsx`.
> New dependencies will be installed: `react-leaflet`, `leaflet`, `recharts`.

## Proposed Changes

### 1. Architecture & Setup
- [ ] **Dependencies**: Install `react-leaflet`, `leaflet`, `recharts`.
- [ ] **Folder Structure**: Create `src/context`, `src/layout`, `src/routes` (optional, can be in App), `src/pages`.
- [ ] **Theme**: Update `index.css` with CSS variables for Light/Dark mode.

### 2. State Management (Context)
#### [NEW] [FleetContext.jsx](file:///Users/carlesllaurado/on-truck/frontend/src/context/FleetContext.jsx)
- Manage global state for `vehiculos`, `rutas`, `conductores`.
- Implement actions: `addVehicle`, `updateVehicle`, `deleteVehicle`, `assignDriver`, etc.

### 3. Layout & Navigation
#### [NEW] [MainLayout.jsx](file:///Users/carlesllaurado/on-truck/frontend/src/layout/MainLayout.jsx)
- Sidebar navigation.
- Header with Theme Toggle.
#### [NEW] [Sidebar.jsx](file:///Users/carlesllaurado/on-truck/frontend/src/layout/Sidebar.jsx)

### 4. Components & Logic
#### [MODIFY] [TarjetaVehiculo.jsx](file:///Users/carlesllaurado/on-truck/frontend/src/components/TarjetaVehiculo.jsx)
- Add Maintenance Alert logic (km vs next revision).
- Add Driver assignment display.
- Block "Taller" state.

#### [NEW] [MapaRuta.jsx](file:///Users/carlesllaurado/on-truck/frontend/src/components/MapaRuta.jsx)
- Leaflet integration.
- Display route polyline.

#### [MODIFY] [VehicleForm.jsx](file:///Users/carlesllaurado/on-truck/frontend/src/components/VehicleForm.jsx)
- Convert to Drawer (Side Panel) style.
- Add Driver selection.

#### [MODIFY] [Estadisticas.jsx](file:///Users/carlesllaurado/on-truck/frontend/src/components/Estadisticas.jsx)
- Implement Recharts graphs.

### 5. Pages
- **Dashboard**: Uses `Estadisticas`.
- **Vehiculos**: Uses `TarjetaVehiculo` list + Filters.
- **Rutas**: Uses `TarjetaRuta` + `MapaRuta`.

## Verification Plan
### Automated Tests
- Build check: `npm run build` (if available) or ensure dev server runs without errors.
### Manual Verification
- Check Dark Mode toggle.
- Verify "Alerta Mantenimiento" appears for high mileage vehicles.
- Verify Map opens in modal/view.
- Verify Recharts graphs render.
