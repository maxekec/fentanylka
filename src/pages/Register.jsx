import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // 👈 импорт CSS

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    login: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'ФИО обязательно';
    } else if (!/^[А-Яа-яЁё\s]+$/.test(formData.fullName)) {
      errs.fullName = 'ФИО должно содержать только кириллицу и пробелы';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Телефон обязателен';
    } else if (!/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
      errs.phone = 'Телефон должен быть в формате +7(XXX)-XXX-XX-XX';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Неверный формат email';
    }

    if (!formData.login.trim()) {
      errs.login = 'Логин обязателен';
    }

    if (!formData.password.trim()) {
      errs.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errs.password = 'Пароль должен быть не менее 6 символов';
    }

    return errs;
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      await axios.post('http://localhost:5000/register', formData);
      alert('Пользователь зарегистрирован!');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        login: '',
        password: ''
      });
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message || 'Ошибка регистрации!';
      setServerError(msg);
    }
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="fullName"
          placeholder="ФИО"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        {errors.fullName && <div className="error-text">{errors.fullName}</div>}

        <input
          type="text"
          name="phone"
          placeholder="Телефон +7(XXX)-XXX-XX-XX"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        {errors.phone && <div className="error-text">{errors.phone}</div>}

        <input
          type="email"
          name="email"
          placeholder="Электронная почта"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className="error-text">{errors.email}</div>}

        <input
          type="text"
          name="login"
          placeholder="Логин"
          value={formData.login}
          onChange={handleChange}
          required
        />
        {errors.login && <div className="error-text">{errors.login}</div>}

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <div className="error-text">{errors.password}</div>}

        {serverError && <div className="error-text">{serverError}</div>}

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register;
