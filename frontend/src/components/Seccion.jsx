import './Seccion.css';

function Seccion({ titulo, children }) {
  return (
    <section className="seccion_contenedor" id={titulo.toLowerCase()}>
      <h2>{titulo}</h2>
      <div className="seccion__contenido">
        {children /* Aquí puedes pasar tarjetas, gráficos, listas, etc. */}
      </div>
    </section>
  );
}

export default Seccion;
