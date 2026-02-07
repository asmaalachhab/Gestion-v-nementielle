import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../data/mockData';
import { ensureSeededStorage, loadUsers, saveUsers, updateUser, changeUserPassword } from '../data/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  updateProfile: (patch: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    ensureSeededStorage();
    // Vérifier si un utilisateur est déjà connecté (localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsed = JSON.parse(savedUser) as User;
      // Recharger l'utilisateur depuis le stockage "users" pour avoir les infos à jour
      const fresh = loadUsers().find(u => u.id === parsed.id) || parsed;
      setUser(fresh);
      localStorage.setItem('currentUser', JSON.stringify(fresh));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = loadUsers().find(u => u.email === email && u.password === password);
    if (foundUser && foundUser.enabled) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Vérifier si l'email existe déjà
    const allUsers = loadUsers();
    const existingUser = allUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    // Créer un nouvel utilisateur (mock)
    const newUser: User = {
      id: allUsers.length ? Math.max(...allUsers.map(u => u.id)) + 1 : 1,
      nom: userData.nom || '',
      prenom: userData.prenom || '',
      email: userData.email || '',
      password: userData.password || '',
      telephone: userData.telephone || '',
      enabled: true,
      date_inscription: new Date().toISOString().split('T')[0],
      roles: [{ id: 1, nom: 'ROLE_CLIENT' }],
    };

    allUsers.push(newUser);
    saveUsers(allUsers);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const updateProfile = async (patch: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 300));
    const updated = updateUser(user.id, patch);
    if (!updated) return false;
    setUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
    return true;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return { ok: false, error: 'Non connecté' };
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = changeUserPassword(user.id, currentPassword, newPassword);
    if (result.ok) {
      // Mettre à jour l'utilisateur en session (sans exposer le mot de passe dans l'UI, mais il est présent dans le mock)
      const refreshed = loadUsers().find(u => u.id === user.id) || user;
      setUser(refreshed);
      localStorage.setItem('currentUser', JSON.stringify(refreshed));
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.some(r => r.nom === role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
