import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ApplicationForm.css';

const carOptions = {
  Toyota: ['Corolla', 'Camry'],
  BMW: ['X5', '3 Series'],
  Audi: ['A4', 'Q7'],
};

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    time: '',
    licenseSeries: '',
    licenseNumber: '',
    licenseIssueDate: '',
    carBrand: '',
    carModel: '',
    message: '',
  });

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
      await axios.post('http://localhost:5000/applications', formData);
      alert('Заявка успешно отправлена!');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        date: '',
        time: '',
        licenseSeries: '',
        licenseNumber: '',
        licenseIssueDate: '',
        carBrand: '',
        carModel: '',
        message: '',
      });
      navigate('/admin');
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error.response?.data || error.message);
      alert('Ошибка при отправке заявки!');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Форма заявки</h2>
      <form onSubmit={handleSubmit} className="application-form">

        <input className="form-input" name="fullName" placeholder="ФИО" value={formData.fullName} onChange={handleChange} required />
        <input className="form-input" name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} required />
        <input className="form-input" name="email" type="email" placeholder="Электронная почта" value={formData.email} onChange={handleChange} required />
        <input className="form-input" name="address" placeholder="Адрес" value={formData.address} onChange={handleChange} required />
        <input className="form-input" name="date" type="date" value={formData.date} onChange={handleChange} required />
        <input className="form-input" name="time" type="time" value={formData.time} onChange={handleChange} required />
        <input className="form-input" name="licenseSeries" placeholder="Серия ВУ" value={formData.licenseSeries} onChange={handleChange} required />
        <input className="form-input" name="licenseNumber" placeholder="Номер ВУ" value={formData.licenseNumber} onChange={handleChange} required />
        <input className="form-input" name="licenseIssueDate" type="date" value={formData.licenseIssueDate} onChange={handleChange} required />

        <select className="form-select" name="carBrand" value={formData.carBrand} onChange={handleChange} required>
          <option value="">Выберите марку</option>
          {Object.keys(carOptions).map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select className="form-select" name="carModel" value={formData.carModel} onChange={handleChange} required disabled={!formData.carBrand}>
          <option value="">Выберите модель</option>
          {formData.carBrand &&
            carOptions[formData.carBrand].map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
        </select>

        <textarea className="form-textarea" name="message" placeholder="Комментарий (необязательно)" value={formData.message} onChange={handleChange} />

        <button className="form-button" type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default ApplicationForm;
