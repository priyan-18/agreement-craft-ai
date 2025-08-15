import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Timer, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  phoneNumber: string;
  onVerifySuccess: () => void;
  onBack: () => void;
}

export const OTPVerification = ({ phoneNumber, onVerifySuccess, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept 123456 as valid OTP
      if (otp === "123456") {
        toast({
          title: "Phone verified!",
          description: "Your mobile number has been successfully verified.",
        });
        onVerifySuccess();
      } else {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    try {
      // Simulate resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your mobile number.",
      });
      
      setTimeLeft(300);
      setCanResend(false);
    } catch (error) {
      toast({
        title: "Resend failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="animate-fade-in-up">
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-3 primary-gradient rounded-full w-16 h-16 flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">
            Verify Your Phone
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We've sent a 6-digit OTP to<br />
            <span className="font-semibold text-foreground">+91 {phoneNumber}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-center block">
                Enter OTP
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={handleOtpChange}
                className="text-center text-2xl tracking-widest font-mono input-focus"
                maxLength={6}
                required
              />
              <p className="text-xs text-muted-foreground text-center">
                For demo purposes, use OTP: 123456
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <Timer className="h-4 w-4" />
                <span>
                  {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "OTP expired"}
                </span>
              </div>

              {canResend && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-primary hover:text-primary/80"
                >
                  {resending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend OTP
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full primary-gradient btn-hover text-white"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="w-full text-muted-foreground hover:text-primary"
              >
                Back to Registration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};