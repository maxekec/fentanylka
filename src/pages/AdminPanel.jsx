import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        {!token ? (
          <>
            <button onClick={() => navigate('/login')} className="admin-btn login-btn">
              Войти
            </button>
            <button onClick={() => navigate('/register')} className="admin-btn register-btn">
              Зарегистрироваться
            </button>
          </>
        ) : (
          <>
            <span className="admin-username">Привет, {username || 'Пользователь'}</span>
            <button onClick={handleLogout} className="admin-btn logout-btn">
              Выйти
            </button>
          </>
        )}
      </div>

      <h2 className="admin-title">Админ Панель</h2>

      <button onClick={() => navigate('/applications-list')} className="admin-nav-btn">
        Перейти к списку заявок
      </button>

      <p className="admin-content">Cодержимое...</p>
    </div>
  );
};

export default AdminPanel;
