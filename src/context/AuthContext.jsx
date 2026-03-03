import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  POLICE: 'Police Officer',
  TOURISM: 'Tourism Officer',
};

const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['dashboard', 'tracking', 'alerts', 'incidents', 'geofence', 'tourists', 'reports', 'settings'],
  [ROLES.POLICE]: ['dashboard', 'tracking', 'alerts', 'incidents', 'tourists', 'reports'],
  [ROLES.TOURISM]: ['dashboard', 'tracking', 'tourists', 'reports', 'geofence'],
};

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    id: 'ADM-001',
    name: 'Raj Kapoor',
    role: ROLES.SUPER_ADMIN,
    email: 'raj.kapoor@stmss.gov.in',
    avatar: null,
  });

  const hasPermission = (module) => {
    const perms = PERMISSIONS[currentUser.role] || [];
    return perms.includes(module);
  };

  const switchRole = (role) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, hasPermission, switchRole, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
}
