import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UserPage = () => {
  const [pin, setPin] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [pinDescription, setPinDescription] = useState<Text | null>(null); // เพิ่ม state สำหรับ description
  const { toast } = useToast();

  const handleNumberClick = (number: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + number);
      setResult(null);
      setPinDescription(null); // reset description
    }
  };

  const handleClear = () => {
    setPin("");
    setResult(null);
    setPinDescription(null);
  };

  const handleCheck = async () => {
    if (pin.length !== 6) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณาใส่รหัส PIN ให้ครบ 6 หลัก",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    
    try {
      // ดึง description มาด้วย
      const { data, error } = await supabase
        .from("pin_codes")
        .select("pin_code, description")  // ดึง description ด้วย
        .eq("pin_code", pin)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        setResult("error");
        setPinDescription(null);
        toast({
          title: "ไม่สำเร็จ",
          description: "รหัส PIN ไม่ถูกต้อง",
          variant: "destructive",
        });
      } else {
        setResult("success");
        setPinDescription(data.description ?? null); // เก็บ description จาก DB
        toast({
          title: "สำเร็จ!",
          description: data.description ?? "รหัส PIN ถูกต้อง",
        });
      }
    } catch (error) {
      console.error("Error checking PIN:", error);
      setResult("error");
      setPinDescription(null);
      toast({
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการตรวจสอบ",
        variant: "destructive",
      });
    }
    
    setIsChecking(false);
  };

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-blue-300 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-white">ใส่รหัส PIN</h1>
          <div className="w-6"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-300" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              ระบบตรวจสอบรหัส
            </h2>
            <p className="text-blue-200 opacity-80">
              ใส่รหัส PIN 6 หลักของคุณ
            </p>
          </div>

          {/* PIN Display */}
          <div className="flex justify-center space-x-3 mb-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  pin.length > i
                    ? result === "success"
                      ? "border-green-400 bg-green-400/20"
                      : result === "error"
                      ? "border-red-400 bg-red-400/20"
                      : "border-blue-400 bg-blue-400/20"
                    : "border-white/30"
                }`}
              >
                {pin.length > i && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Result Icon */}
          {result && (
            <div className="flex justify-center mb-6">
              {result === "success" ? (
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                  <Check className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-scale-in">
                  <X className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          )}

          {/* แสดง Description เมื่อ success */}
          {result === "success" && pinDescription && (
            <p
              className="
                text-center 
                text-green-400 
                text-lg md:text-xl 
                font-extrabold 
                mb-6 
                drop-shadow-lg
                animate-pulse
              "
            >
              {pinDescription}
            </p>
          )}

          {/* Number Keypad */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {numbers.map((number) => (
              <Button
                key={number}
                onClick={() => handleNumberClick(number)}
                className="h-16 text-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 hover:scale-105"
                disabled={isChecking}
              >
                {number}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleClear}
              variant="outline"
              className="h-12 border-white/30 text-white hover:bg-white/10"
              disabled={isChecking}
            >
              ล้าง
            </Button>
            <Button
              onClick={handleCheck}
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isChecking || pin.length !== 6}
            >
              {isChecking ? "กำลังตรวจสอบ..." : "ตรวจสอบ"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
