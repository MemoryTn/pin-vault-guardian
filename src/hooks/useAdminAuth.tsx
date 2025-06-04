
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  email: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is already logged in
    const adminData = localStorage.getItem("adminUser");
    if (adminData) {
      setAdminUser(JSON.parse(adminData));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For development purposes, we'll use a simple password check
      // In production, you would want to implement proper password hashing
      const { data, error } = await supabase
        .from("admin_users")
        .select("id, email, password_hash")
        .eq("email", email)
        .single();

      if (error || !data) {
        return { error: "Invalid email or password" };
      }

      // Simple password verification (in production, use proper hashing)
      // For now, we'll assume the password_hash is just the plain password
      if (data.password_hash !== password) {
        return { error: "Invalid email or password" };
      }

      const user = { id: data.id, email: data.email };
      setAdminUser(user);
      localStorage.setItem("adminUser", JSON.stringify(user));
      
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "ยินดีต้อนรับเข้าสู่ระบบผู้คุม",
      });

      return { error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
    }
  };

  const logout = async () => {
    setAdminUser(null);
    localStorage.removeItem("adminUser");
    toast({
      title: "ออกจากระบบแล้ว",
      description: "ขอบคุณที่ใช้บริการ",
    });
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
