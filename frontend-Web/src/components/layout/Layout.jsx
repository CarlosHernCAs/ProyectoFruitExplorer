import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="layout__main">
        {/* Navbar */}
        <Navbar onMenuToggle={toggleSidebar} />

        {/* Content */}
        <main className="layout__content">
          {children}
        </main>

        {/* Footer */}
        <footer className="layout__footer">
          <p>© 2025 FruitExplorer | Desarrollado con 💚</p>
          <p className="layout__footer-links">
            <a href="#privacy">Privacidad</a>
            <span>·</span>
            <a href="#terms">Términos</a>
            <span>·</span>
            <a href="#contact">Contacto</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
