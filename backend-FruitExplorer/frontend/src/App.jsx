import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Login from "./login";
import Register from "./register";

function App() {
  return (
    <Router>
      {/* Barra de navegación simple */}
      <nav style={{ margin: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Inicio</Link>
        <Link to="/register" style={{ marginRight: "10px" }}>Registro</Link>
        <Link to="/login">Login</Link>
      </nav>

      {/* Definición de rutas */}
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center" }}>
              <h1>Bienvenido a FruitExplorer 🍓</h1>
              <p>Explora, registra y descubre el mundo de las frutas.</p>
            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
