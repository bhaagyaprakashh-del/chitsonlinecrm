import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppRole = "Admin" | "Employee" | "Agent" | "Subscriber";

interface User {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  permissions: string[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check against all created users
    try {
      // Get all users from localStorage
      const usersData = localStorage.getItem('users_data');
      let allUsers = [];
      
      if (usersData) {
        try {
          const parsedUsers = JSON.parse(usersData);
          allUsers = Array.isArray(parsedUsers) ? parsedUsers : [];
        } catch (error) {
          console.error('Error parsing users data:', error);
        }
      }
      
      // Add default admin user if not exists
      const defaultAdmin = {
        id: 'admin_default',
        name: 'Prakash',
        email: 'prakash@ramnirmalchits.com',
        username: 'Prakash',
        password: 'Prakashh@55',
        role: 'Admin',
        permissions: ['*'],
        category: 'Admin',
        status: 'Active'
      };
      
      const adminExists = allUsers.some(u => u.username === 'Prakash');
      if (!adminExists) {
        allUsers.push(defaultAdmin);
      }
      
      // Find user by username and password
      const foundUser = allUsers.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role || foundUser.category,
          permissions: foundUser.permissions || [],
          avatar: foundUser.avatar
        };
        
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setUser(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};