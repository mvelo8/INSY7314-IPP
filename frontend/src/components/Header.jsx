import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="container header-inner">
        <Link to="/" className="brand">International Payments</Link>

        <nav className="nav-links">
          {isAuthenticated && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/transactions/new">New Transaction</Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-link">Login</Link>
              <Link to="/register" className="btn-primary small">Register</Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className="btn-secondary small">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
