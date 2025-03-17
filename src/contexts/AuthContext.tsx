
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (module: "documents" | "purchaseOrders" | "users") => boolean;
}

const mockUser: User = {
  id: "1",
  name: "Administrador",
  email: "admin@docukeeper.com",
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

  // Simula verificação de autenticação ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("docukeeper_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulação de login - em produção, conectaria a um backend real
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula chamada de API
      
      // Valida o usuário (em produção, isso seria uma chamada de API)
      if (email === "admin@docukeeper.com" && password === "admin") {
        setUser(mockUser);
        localStorage.setItem("docukeeper_user", JSON.stringify(mockUser));
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("docukeeper_user");
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
