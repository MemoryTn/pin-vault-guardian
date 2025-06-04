
import { Link } from "react-router-dom";
import { Shield, Users, Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            PIN Security System
          </h1>
          <p className="text-xl text-blue-200 opacity-90">
            ระบบตรวจสอบรหัส PIN ขั้นสูง
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* User Section */}
          <Link to="/user" className="group">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/30 transition-colors">
                  <Users className="w-10 h-10 text-blue-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  ผู้ใช้งาน
                </h2>
                <p className="text-blue-200 opacity-80">
                  ใส่รหัส PIN เพื่อตรวจสอบ
                </p>
              </div>
            </div>
          </Link>

          {/* Admin Section */}
          <Link to="/admin" className="group">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-colors">
                  <Shield className="w-10 h-10 text-purple-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  ผู้คุมระบบ
                </h2>
                <p className="text-purple-200 opacity-80">
                  จัดการรหัส PIN ในระบบ
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="inline-flex items-center space-x-2 text-blue-200/60">
              <Shield className="w-5 h-5" />
              <span className="text-sm">ระบบรักษาความปลอดภัยขั้นสูง</span>
            </div>
            
            <Link 
              to="/admin/login" 
              className="inline-flex items-center space-x-2 text-purple-300/60 hover:text-purple-200 transition-colors text-sm"
            >
              <Lock className="w-4 h-4" />
              <span>เข้าสู่ระบบผู้คุม</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
