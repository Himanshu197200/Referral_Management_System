import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

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

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onSwitchToLogin={() => setShowRegister(false)}
          onBack={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onSwitchToRegister={() => setShowRegister(true)}
        onBack={() => { }}
      />
    );
  }

  return (
    <div className="app">
      <Dashboard
        user={user}
        onLogout={logout}
        onLoginClick={() => { }}
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
