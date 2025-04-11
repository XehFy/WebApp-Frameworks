import React, { Suspense, useState, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthForm from './components/AuthForm';
import './App.css';

interface MicroFrontendProps {
  user: {
    role: 'client' | 'admin';
    email?: string;
  };
  token?: string;
}

const RemoteRTKApp = lazy(() => import('rtkApp/App') as Promise<{
  default: React.ComponentType<MicroFrontendProps>;
}>);

const RemoteMobXApp = lazy(() => import('mobxApp/App') as Promise<{
  default: React.ComponentType<MicroFrontendProps>;
}>);

const App: React.FC = () => {
  const [user, setUser] = useState<MicroFrontendProps['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <Provider store={store}>
      <div className="App">
        {user && (
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        )}

        {!user ? (
          <AuthForm
            onSuccess={({ token, ...userData }) => {
              setUser(userData);
              setToken(token);
              localStorage.setItem('token', token);
              console.log('✅ onSuccess: user и token переданы напрямую:', userData, token);
            }}
          />
        ) : user.role === 'client' ? (
          <Suspense fallback={<div className="loading">Загрузка клиентского кабинета...</div>}>
            <RemoteRTKApp user={user} token={token || ''} />
          </Suspense>
        ) : (
          <Suspense fallback={<div className="loading">Загрузка админ-панели...</div>}>
            <RemoteMobXApp user={user} token={token || ''} />
          </Suspense>
        )}
      </div>
    </Provider>
  );
};

export default App;
