import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ApplicationsList from './pages/ApplicationsList';
import Login from './pages/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const isLoggedIn = !!token;

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/" element={isLoggedIn ? <h1>Добро пожаловать!</h1> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {isLoggedIn && <Route path="/applications" element={<ApplicationsList token={token} />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
