import Navbar from "./components/navbar.jsx";
import "./App.css";
import Seccion from "./components/Seccion.jsx";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__content">
        <Seccion titulo="Vehículos" />
        <Seccion titulo="Rutas" />
        <Seccion titulo="Estadísticas" />
      </main>
    </div>
  );
}

export default App;
