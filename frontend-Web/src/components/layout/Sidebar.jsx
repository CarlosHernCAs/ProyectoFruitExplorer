import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import {
  Home,
  Apple,
  BookOpen,
  MapPin,
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Camera
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ isOpen, onToggle }) {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    {
      title: 'General',
      items: [
        { path: '/', icon: Home, label: 'Inicio' },
        { path: '/fruits', icon: Apple, label: 'Frutas' },
        { path: '/recognize', icon: Camera, label: 'Reconocer Fruta' },
        { path: '/recipes', icon: BookOpen, label: 'Recetas' },
        { path: '/regions', icon: MapPin, label: 'Regiones' },
      ]
    },
    ...(user ? [{
      title: 'Administración',
      items: [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/admin/tools', icon: Settings, label: 'Herramientas' },
        { path: '/users', icon: Users, label: 'Usuarios' },
      ]
    }] : [])
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Header */}
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <span className="sidebar__logo-icon">🍓</span>
            <span className="sidebar__logo-text">FruitExplorer</span>
          </div>

          <button
            className="sidebar__close"
            onClick={onToggle}
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {navItems.map((section, idx) => (
            <div key={idx} className="sidebar__section">
              <p className="sidebar__section-title">{section.title}</p>
              <ul className="sidebar__list">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                      }
                      onClick={() => window.innerWidth < 1024 && onToggle()}
                    >
                      <item.icon size={20} className="sidebar__link-icon" />
                      <span className="sidebar__link-text">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer / User */}
        {user && (
          <div className="sidebar__footer">
            <div className="sidebar__user">
              <div className="sidebar__user-avatar">
                {user.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="sidebar__user-info">
                <p className="sidebar__user-name">
                  {user.display_name || user.email}
                </p>
                <p className="sidebar__user-email">{user.email}</p>
              </div>
            </div>

            <button
              className="sidebar__logout"
              onClick={logout}
              aria-label="Cerrar sesión"
            >
              <LogOut size={20} />
              <span>Salir</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
