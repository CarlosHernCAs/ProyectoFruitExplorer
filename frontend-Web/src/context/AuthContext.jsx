import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✨ Nuevo estado de carga

  // 🟢 Cargar usuario y token desde localStorage al iniciar
  useEffect(() => {
    console.log("🔍 AuthContext: Cargando sesión desde localStorage...");
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("usuario");

    console.log("📦 Token guardado:", savedToken ? "✅ Existe" : "❌ No existe");
    console.log("📦 Usuario guardado:", savedUser ? "✅ Existe" : "❌ No existe");

    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        console.log("✅ Sesión restaurada:", parsedUser.email || parsedUser.display_name);
        console.log("👤 Datos del usuario completos:", parsedUser);
        console.log("🔑 Rol del usuario:", parsedUser.role || "❌ NO TIENE ROL");
      } catch (error) {
        console.error("❌ Error parsing saved user data:", error);
        // Limpiar datos corruptos
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      }
    } else {
      console.log("⚠️ No hay sesión guardada");
    }

    // ✅ Marcar como cargado después de verificar localStorage
    setLoading(false);
    console.log("✅ AuthContext: Carga completada");
  }, []);

  // 🟢 Iniciar sesión (guardar token + usuario)
  const login = (newToken, newUser) => {
    console.log("🔐 Login: Guardando sesión...");
    console.log("  Token:", newToken ? "✅ Recibido" : "❌ Vacío");
    console.log("  Usuario:", newUser);

    setToken(newToken);
    setUser(newUser);

    localStorage.setItem("token", newToken);
    localStorage.setItem("usuario", JSON.stringify(newUser));

    console.log("✅ Sesión guardada en localStorage");
    console.log("  Token guardado:", localStorage.getItem("token") ? "✅" : "❌");
    console.log("  Usuario guardado:", localStorage.getItem("usuario") ? "✅" : "❌");
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
