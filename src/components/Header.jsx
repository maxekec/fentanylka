import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout }) => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          МойПроект
        </Link>
      </div>
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>Главная</Link>
        {isLoggedIn && <Link to="/applications" style={styles.navLink}>Заявки</Link>}
        {!isLoggedIn && <Link to="/login" style={styles.navLink}>Войти</Link>}
        {isLoggedIn && (
          <button onClick={onLogout} style={styles.logoutButton}>Выйти</button>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#222',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  nav: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    cursor: 'pointer',
    padding: '5px 10px',
    borderRadius: '4px',
  },
};

export default Header;
