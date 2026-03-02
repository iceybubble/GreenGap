import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <button 
        className="user-profile-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.picture ? (
          <img src={user.picture} alt={user.name} className="user-avatar" />
        ) : (
          <div className="user-avatar-placeholder">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <span className="user-name">{user.name}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <>
          <div className="dropdown-overlay" onClick={() => setIsOpen(false)} />
          <div className="user-dropdown">
            <div className="user-info">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="user-avatar-large" />
              ) : (
                <div className="user-avatar-placeholder-large">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="user-details">
                <div className="user-name-large">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            <div className="dropdown-divider" />
            <button className="dropdown-item" onClick={() => navigate('/dashboard')}>
            Dashboard
            </button>
            <button className="dropdown-item" onClick={() => navigate('/settings')}>
            Settings
            </button>
            <div className="dropdown-divider" />
            <button className="dropdown-item logout" onClick={handleLogout}>
            Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}