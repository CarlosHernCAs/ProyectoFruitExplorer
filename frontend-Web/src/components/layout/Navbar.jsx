import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, LogIn } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../ui/Button';
import './Navbar.css';

export default function Navbar({ onMenuToggle }) {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Menu Toggle (Mobile) */}
        <button
          className="navbar__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Logo (Mobile Only) */}
        <div className="navbar__logo">
          <span>🍓</span>
          <span>FruitExplorer</span>
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          {user ? (
            <div className="navbar__user">
              <div className="navbar__user-avatar">
                <User size={20} />
              </div>
              <span className="navbar__user-name">
                {user.display_name || user.email}
              </span>
            </div>
          ) : (
            <div className="navbar__auth-buttons">
              <Link to="/login">
                <Button variant="ghost" size="sm" icon={LogIn}>
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
