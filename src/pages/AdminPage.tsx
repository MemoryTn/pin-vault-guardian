
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Plus, Trash2, Eye, EyeOff, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

const AdminPageContent = () => {
  const [pins, setPins] = useState(["123456", "654321", "111111", "000000"]);
  const [newPin, setNewPin] = useState("");
  const [showPins, setShowPins] = useState(false);
  const { toast } = useToast();
  const { adminUser, logout } = useAdminAuth();

  const handleAddPin = () => {
    if (newPin.length !== 6) {
      toast({
        title: "ข้อผิดพลาด",
        description: "รหัส PIN ต้องมี 6 หลักเท่านั้น",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d+$/.test(newPin)) {
      toast({
        title: "ข้อผิดพลาด",
        description: "รหัส PIN ต้องเป็นตัวเลขเท่านั้น",
        variant: "destructive",
      });
      return;
    }

    if (pins.includes(newPin)) {
      toast({
        title: "ข้อผิดพลาด",
        description: "รหัส PIN นี้มีอยู่ในระบบแล้ว",
        variant: "destructive",
      });
      return;
    }

    setPins(prev => [...prev, newPin]);
    setNewPin("");
    toast({
      title: "สำเร็จ!",
      description: "เพิ่มรหัส PIN ใหม่แล้ว",
    });
  };

  const handleDeletePin = (pinToDelete: string) => {
    setPins(prev => prev.filter(pin => pin !== pinToDelete));
    toast({
      title: "สำเร็จ!",
      description: "ลบรหัส PIN แล้ว",
    });
  };

  const formatPin = (pin: string) => {
    return showPins ? pin : "••••••";
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-blue-300 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-white">ผู้คุมระบบ</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-red-300/30 text-red-300 hover:bg-red-500/10 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            ออกจากระบบ
          </Button>
        </div>

        {/* Welcome Message */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">ยินดีต้อนรับ</h2>
              <p className="text-green-200">{adminUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">สถิติระบบ</h2>
              <p className="text-purple-200">รหัส PIN ทั้งหมด: {pins.length} รหัส</p>
            </div>
          </div>
        </div>

        {/* Add New PIN */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">เพิ่มรหัส PIN ใหม่</h3>
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="ใส่รหัส PIN 6 หลัก"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.slice(0, 6))}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
              maxLength={6}
            />
            <Button
              onClick={handleAddPin}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่ม
            </Button>
          </div>
        </div>

        {/* PIN List */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">รหัส PIN ในระบบ</h3>
            <Button
              onClick={() => setShowPins(!showPins)}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              size="sm"
            >
              {showPins ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  ซ่อน
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  แสดง
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {pins.map((pin, index) => (
              <div
                key={pin}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-200">#{index + 1}</span>
                  <span className="text-white font-mono text-lg tracking-widest">
                    {formatPin(pin)}
                  </span>
                </div>
                <Button
                  onClick={() => handleDeletePin(pin)}
                  variant="outline"
                  size="sm"
                  className="border-red-300/30 text-red-300 hover:bg-red-500/10 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            {pins.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60">ยังไม่มีรหัส PIN ในระบบ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  return (
    <AdminProtectedRoute>
      <AdminPageContent />
    </AdminProtectedRoute>
  );
};

export default AdminPage;
