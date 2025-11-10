import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'dental_auth_user';

const MOCK_USERS = [
  {
    id: '1',
    email: 'client@test.com',
    name: 'John Doe',
    role: 'client' as UserRole,
    phone: '555-0123',
  },
  {
    id: '2',
    email: 'admin@test.com',
    name: 'Dr. Sarah Smith',
    role: 'admin' as UserRole,
    phone: '555-0456',
  },
];

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
    setUser(foundUser);
    return foundUser;
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string
  ) => {
    const existingUser = MOCK_USERS.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      phone,
    };

    MOCK_USERS.push(newUser);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client',
    login,
    register,
    logout,
  }), [user, isLoading, login, register, logout]);
});
