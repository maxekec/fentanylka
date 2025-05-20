import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      console.log('Авторизация успешна:', response.data);
console.log('Ответ сервера при логине:', response.data);
      localStorage.setItem('token', response.data.token);
    const savedToken = localStorage.getItem('token');
    console.log('Токен, сохранённый в localStorage:', savedToken);
      navigate('/application-form');
    } catch (error) {
      console.error('Ошибка при входе:', error.response?.data || error.message);
      alert('Ошибка входа. Проверьте логин и пароль.');
    }
  };

  return (
    <div className="login-container">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="login"
          placeholder="Логин"
          value={formData.login}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default Login;
