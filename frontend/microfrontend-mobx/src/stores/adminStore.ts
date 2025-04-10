import { makeAutoObservable } from 'mobx';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
}

class AdminStore {
  users: User[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchUsers() {
    try {
      const response = await axios.get<User[]>('http://localhost:3000/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.users = response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }
}

export default new AdminStore();