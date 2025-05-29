import React, { createContext, useContext, useState, useEffect } from 'react';
import { Database } from '../utils/database';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  users: User[];
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createUser: (userData: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const loadedUsers = await Database.getUsers();
    setUsers(loadedUsers);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const matchedUser = users.find(
      u => u.email === email && u.password === password
    );
    
    if (!matchedUser) {
      throw new Error('Credenciais inválidas');
    }

    const { password: _, ...userWithoutPassword } = matchedUser;
    setUser(userWithoutPassword);
  };

  const signOut = async () => {
    setUser(null);
  };

  const createUser = async (userData: Omit<User, 'id'>) => {
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Já existe um usuário com este email');
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };

    await Database.addUser(newUser);
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    if (userData.email && users.some(u => u.email === userData.email && u.id !== id)) {
      throw new Error('Já existe um usuário com este email');
    }

    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return {
          ...user,
          ...userData,
          password: userData.password || user.password
        };
      }
      return user;
    });

    await Database.saveUsers(updatedUsers);
    setUsers(updatedUsers);

    if (user?.id === id) {
      setUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  const deleteUser = async (id: string) => {
    if (users.length === 1) {
      throw new Error('Não é possível excluir o último usuário');
    }

    if (user?.id === id) {
      throw new Error('Não é possível excluir sua própria conta');
    }

    await Database.deleteUser(id);
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      signIn, 
      signOut,
      createUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};