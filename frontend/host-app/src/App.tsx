import React, { Suspense, useState, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthForm from './components/AuthForm';
import './App.css';

// Создаем интерфейс для пропсов микрофронтендов
interface MicroFrontendProps {
  user: {
    role: 'client' | 'admin';
    email?: string;
  };
}

// Явно указываем типы для динамических импортов
const RemoteRTKApp = lazy(() => import('rtkApp/App') as Promise<{
  default: React.ComponentType<MicroFrontendProps>;
}>);

const RemoteMobXApp = lazy(() => import('mobxApp/App') as Promise<{
  default: React.ComponentType<MicroFrontendProps>;
}>);

const App: React.FC = () => {
  const [user, setUser] = useState<MicroFrontendProps['user'] | null>(null);

  return (
    <Provider store={store}>
      <div className="App">
        {user && (
          <button onClick={() => {
            localStorage.removeItem('token');
            setUser(null);
          }} className="logout-button">
            Выйти
          </button>
        )}
        
        {!user ? (
          <AuthForm onSuccess={setUser} />
        ) : user.role === 'client' ? (
          <Suspense fallback={<div className="loading">Загрузка клиентского кабинета...</div>}>
            <RemoteRTKApp user={user} />
          </Suspense>
        ) : (
          <Suspense fallback={<div className="loading">Загрузка админ-панели...</div>}>
            <RemoteMobXApp user={user} />
          </Suspense>
        )}
      </div>
    </Provider>
  );
};

export default App;