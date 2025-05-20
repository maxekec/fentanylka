import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ApplicationsList.css';

const statusMap = {
  all: 'Все',
  approved: 'Одобрено',
  completed: 'Выполнено',
  rejected: 'Отклонено',
  pending: 'В ожидании',
};

const ApplicationsList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту заявку?')) return;

    try {
      await axios.delete(`http://localhost:5000/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (error) {
      alert('Ошибка при удалении заявки');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Ошибка при получении заявок:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications =
    filterStatus === 'all'
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (loading) return <p>Загрузка заявок...</p>;

  return (
    <div className="applications-container">
      <div className="applications-header">
        {!token ? (
          <>
            <button onClick={() => navigate('/login')} className="admin-btn login-btn">Войти</button>
            <button onClick={() => navigate('/register')} className="admin-btn register-btn">Зарегистрироваться</button>
          </>
        ) : (
          <>
            <span className="admin-username">Привет, {username || 'Пользователь'}</span>
            <button onClick={handleLogout} className="admin-btn logout-btn">Выйти</button>
          </>
        )}
      </div>

      <h2 className="applications-title">Список заявок</h2>

      <label htmlFor="statusFilter" className="filter-label">Фильтр по статусу: </label>
      <select
        id="statusFilter"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="status-select"
      >
        {Object.entries(statusMap).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      {filteredApplications.length === 0 ? (
        <p>Заявок не найдено.</p>
      ) : (
        <ul className="applications-list">
          {filteredApplications.map((app) => (
            <li key={app.id} className="application-item">
              <strong>{app.fullName}</strong> — {app.phone}, {app.email}
              <br />
              <b>Статус:</b> {statusMap[app.status] || app.status}
              <br />
              <em>{app.message || 'Без комментария'}</em>
              <br />
              <button
                onClick={() => handleDelete(app.id)}
                className="delete-btn"
              >
                Удалить заявку
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplicationsList;
