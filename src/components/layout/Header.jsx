import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import '../../styles/components/header.css';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Result', to: '/result' },
  { label: 'Centers', to: '/centers' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Rewards', to: '/gamification' },
  { label: 'Chatbot', to: '/chatbot' },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, isDarkMode, logout, toggleTheme } = useAppContext();

  const handleToggleMenu = () => {
    setIsMenuOpen((currentValue) => !currentValue);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate('/login', { replace: true });
  };

  return (
    <header className="site-header">
      <div className="page-shell">
        <div className="site-header__inner">
          <NavLink className="brand-lockup" to="/" onClick={handleCloseMenu}>
            <div className="brand-lockup__badge">EA</div>
            <div>
              <span className="brand-lockup__eyebrow">EcoSort AI</span>
              <strong>Premium Waste Intelligence</strong>
            </div>
          </NavLink>

          <button
            className="menu-toggle"
            type="button"
            onClick={handleToggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>

          <div
            className={`site-header__panel ${
              isMenuOpen ? 'site-header__panel--open' : ''
            }`}
          >
            <nav className="site-nav" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `site-nav__link ${isActive ? 'site-nav__link--active' : ''}`
                  }
                  onClick={handleCloseMenu}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="site-header__actions">
              <div className="account-cluster">
                <div className="user-pill">
                  <span className="user-pill__name">{currentUser?.fullName}</span>
                  <span className="user-pill__email">{currentUser?.email}</span>
                </div>
                <button className="logout-link" onClick={handleLogout} type="button">
                  Logout
                </button>
              </div>

              <div className="utility-cluster">
                <button
                  className="theme-toggle"
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? 'Light mode' : 'Dark mode'}
                </button>
                <Button to="/result" onClick={handleCloseMenu}>
                  Latest Scan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
