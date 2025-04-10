import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import adminStore from './stores/adminStore';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AdminAppProps {
  user?: User; // Опциональный пропс
}

const AdminApp: React.FC<AdminAppProps> = observer(({ user }) => {
  if (!user) {
    return <div className="auth-message">Требуются права администратора</div>;
  }

  return (
    <div style={{ border: '2px solid red', padding: 20 }}>
      <h2>Админ-панель (MobX)</h2>
      <p>Вы вошли как: {user?.email}</p>
      
      <h3>Пользователи системы:</h3>
      <ul>
        {adminStore.users.map((user: User) => (
          <li key={user.id}>
            {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default AdminApp;