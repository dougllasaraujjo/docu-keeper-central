
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (module: "documents" | "purchaseOrders" | "users") => boolean;
}

const mockUser: User = {
  id: "1",
  name: "Administrador",
  email: "admin@enextdoc.com",
  role: "admin",
  permissions: {
    documents: true,
    purchaseOrders: true,
    users: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("enextdoc_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@enextdoc.com" && password === "admin") {
        setUser(mockUser);
        localStorage.setItem("enextdoc_user", JSON.stringify(mockUser));
      } else {
        const stored = localStorage.getItem("enextdoc_registered_users");
        const users = stored ? JSON.parse(stored) : [];
        const foundUser = users.find((user: any) => user.email === email && user.password === password);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem("enextdoc_user", JSON.stringify(foundUser));
        } else {
          throw new Error("Credenciais inválidas");
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

const register = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const stored = localStorage.getItem("enextdoc_registered_users");
    let users = stored ? JSON.parse(stored) : [];
    if (users.some((u: any) => u.email === email)) {
      throw new Error("Usuário já cadastrado");
    }
    const newUser = {
      id: (users.length + 1).toString(),
      name: email,
      email,
      role: "user",
      permissions: {
        documents: true,
        purchaseOrders: false,
        users: false,
      },
      password,
    };
    users.push(newUser);
    localStorage.setItem("enextdoc_registered_users", JSON.stringify(users));
  } catch (error) {
    throw error;
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("enextdoc_user");
  };

  const hasPermission = (module: "documents" | "purchaseOrders" | "users") => {
    if (!user) return false;
    return user.permissions[module];
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };

