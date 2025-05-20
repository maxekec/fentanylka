import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ApplicationForm from '../pages/ApplicationForm';
import ApplicationsList from '../pages/ApplicationsList';
import AdminPanel from '../pages/AdminPanel';
import { useEffect, useState } from 'react';

function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
    }

    setLoading(false);
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Корневой маршрут */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Страницы регистрации и логина */}
        <Route path="/register" element={isAuthenticated ? <Navigate to="/application-form" /> : <Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/application-form" /> : <Login />} />

        {/* Защищённые маршруты */}
        <Route path="/application-form" element={isAuthenticated ? <ApplicationForm /> : <Navigate to="/login" />} />
        <Route path="/applications-list" element={isAuthenticated ? <ApplicationsList /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
