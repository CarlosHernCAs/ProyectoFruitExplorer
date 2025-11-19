import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✨ Nuevo estado de carga

  // 🟢 Cargar usuario y token desde localStorage al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("usuario");

    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        // Limpiar datos corruptos
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      }
    }

    // ✅ Marcar como cargado después de verificar localStorage
    setLoading(false);
  }, []);

  // 🟢 Iniciar sesión (guardar token + usuario)
  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);

    localStorage.setItem("token", newToken);
    localStorage.setItem("usuario", JSON.stringify(newUser));
  };

  // 🔴 Cerrar sesión
  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "/login";
  };

  // 🔄 Mostrar spinner mientras se verifica la sesión
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        Cargando... 🍓
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
