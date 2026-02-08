import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="app">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleLoginClick = () => setCurrentPage('login');
  const handleRegisterClick = () => setCurrentPage('register');
  const handleBackToDashboard = () => setCurrentPage('dashboard');

  if (currentPage === 'login' && !user) {
    return (
      <Login
        onSwitchToRegister={handleRegisterClick}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentPage === 'register' && !user) {
    return (
      <Register
        onSwitchToLogin={handleLoginClick}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="app">
      <Dashboard
        user={user}
        onLogout={logout}
        onLoginClick={handleLoginClick}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
