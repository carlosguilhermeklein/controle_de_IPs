import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginForm from './components/auth/LoginForm';
import { Toaster } from './components/ui/Toaster';

const AuthenticatedApp = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <NetworkProvider>
      <Layout />
      <Toaster />
    </NetworkProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;