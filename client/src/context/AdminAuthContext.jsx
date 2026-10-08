import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

// Hardcoded admin credentials for prototype
const ADMIN_EMAIL    = 'admin@schememate.ai';
const ADMIN_PASSWORD = 'Admin@12345';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sm_admin_user');
      if (stored) setAdmin(JSON.parse(stored));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const adminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        name: 'SchemeMate Admin',
        email: ADMIN_EMAIL,
        role: 'super_admin',
      };
      localStorage.setItem('sm_admin_token', 'proto_admin');
      localStorage.setItem('sm_admin_user', JSON.stringify(adminUser));
      setAdmin(adminUser);
      return { admin: adminUser };
    }
    throw new Error('Invalid admin credentials.');
  };

  const adminLogout = () => {
    localStorage.removeItem('sm_admin_token');
    localStorage.removeItem('sm_admin_user');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, adminLogin, adminLogout, isAdmin: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
