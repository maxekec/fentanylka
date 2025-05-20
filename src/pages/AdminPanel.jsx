import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Точно удалить заявку?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/applications/${id}`);
      setApplications(applications.filter((app) => app.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении заявки:', error);
    }
  };

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

      <div className="applications-list">
        <h3>Список заявок:</h3>
        {applications.length === 0 ? (
          <p>Заявок пока нет.</p>
        ) : (
          <ul>
            {applications.map((app) => (
              <li key={app.id}>
                <strong>Имя:</strong> {app.name} <br />
                <strong>Email:</strong> {app.email} <br />
                <strong>Сообщение:</strong> {app.message} <br />
                <button onClick={() => handleDelete(app.id)} className="admin-delete-btn">
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
