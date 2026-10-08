import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const USERS_KEY   = 'sm_users';
const TOKEN_KEY   = 'sm_token';
const USER_KEY    = 'sm_user';
const PROFILE_KEY = 'sm_profile';

// ── helpers ──────────────────────────────────────────────────
const getUsers  = () => JSON.parse(localStorage.getItem(USERS_KEY)  || '[]');
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
};
const getProfile = () => {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)); } catch { return null; }
};

const isProfileComplete = (profile) => {
  if (!profile) return false;
  return !!(profile.age && profile.gender && profile.state && profile.occupation && profile.annualIncome);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]                       = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  const loadUser = useCallback(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setProfileComplete(isProfileComplete(getProfile()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const register = (name, email, password, phone) => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase(),
      password,          // prototype: stored plain-text (no backend)
      phone: phone || '',
      preferredLanguage: 'en',
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(TOKEN_KEY, `proto_${newUser.id}`);
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    setProfileComplete(false);
    return { user: safeUser, profileComplete: false };
  };

  const login = (email, password) => {
    const users = getUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error('Invalid email or password.');
    const { password: _, ...safeUser } = found;
    localStorage.setItem(TOKEN_KEY, `proto_${found.id}`);
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    const complete = isProfileComplete(getProfile());
    setProfileComplete(complete);
    return { user: safeUser, profileComplete: complete };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setProfileComplete(false);
  };

  const updateProfileComplete = (val) => setProfileComplete(val);

  const updateLanguage = (lang) => {
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx].preferredLanguage = lang;
      saveUsers(users);
    }
    const updated = { ...user, preferredLanguage: lang };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, profileComplete,
      login, register, logout, loadUser,
      updateProfileComplete, updateLanguage,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
