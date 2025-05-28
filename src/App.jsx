import { useEffect, useState } from 'react';

function App() {
  const [logs, setLogs] = useState([]);

  // Traer historial del backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Corrige la URL aquí (.app, no .ap)
        const res = await fetch("https://arduino-back-tau.vercel.app/api/logs");
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Error al obtener logs:", err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000); // actualiza cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  // Enviar una flecha
  const enviarFlecha = async (flecha) => {
    try {
      const res = await fetch("https://arduino-back-tau.vercel.app/api/flecha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ button: flecha }),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const { log } = await res.json();
      setLogs((prev) => [log, ...prev]); // Agrega al historial visible
    } catch (error) {
      console.error("Error al enviar flecha:", error);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Control de Arduino - Flechas</h1>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <button onClick={() => enviarFlecha("Arriba")} style={estiloBoton}>⬆️</button>
        <div>
          <button onClick={() => enviarFlecha("Izquierda")} style={estiloBoton}>⬅️</button>
          <button onClick={() => enviarFlecha("Abajo")} style={estiloBoton}>⬇️</button>
          <button onClick={() => enviarFlecha("Derecha")} style={estiloBoton}>➡️</button>
        </div>
      </div>

      <h2>Historial de acciones</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Flecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>{log.button}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const estiloBoton = {
  fontSize: "2rem",
  margin: "0.5rem",
  padding: "1rem 1.5rem",
  cursor: "pointer",
};

export default App;
