import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../components/Navigation.css';

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-title">🗺️ Travel Map</h1>
        </div>

        <ul className="navbar-menu">
          {isAuthenticated ? (
            <>
              <li>
                <a href="/feed">Feed</a>
              </li>
              <li>
                <a href="/map">Map</a>
              </li>
              <li>
                <a href="/create">Create Post</a>
              </li>
              <li className="navbar-user">
                <span className="user-name">{user?.name || 'User'}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/register">Register</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
