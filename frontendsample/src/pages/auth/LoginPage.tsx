import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import MarketingLayout from "@/layouts/MarketingLayout";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validate form whenever fields change
  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 6;

    setEmailError(
      isEmailValid || email.length === 0
        ? ""
        : "Please enter a valid email address"
    );
    setPasswordError(
      isPasswordValid || password.length === 0
        ? ""
        : "Password must be at least 6 characters"
    );

    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_email: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Login error",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      } else {
        // Store basic user session without JWT
        localStorage.setItem(
          "user",
          JSON.stringify({
            userType: data.userType,
            data: data.data,
          })
        );

        toast({
          title: "Login successful",
          description: "Welcome back to Smart AwamAssist",
        });

        // Redirect to main dashboard
        navigate("/company/hero-section");
      }
    } catch (err: any) {
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      const decoded: any = jwtDecode(credentialResponse.credential);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            google_token: credentialResponse.credential,
            email: decoded.email,
            sub: decoded.sub,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Google login error",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        // Store basic user session without JWT
        localStorage.setItem(
          "user",
          JSON.stringify({
            userType: data.userType,
            data: data.data,
          })
        );

        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });

        navigate("/company/hero-section");
      }
    } catch (error) {
      toast({
        title: "Google login error",
        description: "Something went wrong during Google login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    toast({
      title: "Google login failed",
      description: "Please try again or use email login",
      variant: "destructive",
    });
  };

  return (
    <MarketingLayout>
      <GoogleOAuthProvider clientId="554055055478-rknhms5v8p9k3gcn7dmjo18r9tp1lqvi.apps.googleusercontent.com">
        <div className="flex min-h-screen bg-white justify-center">
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back!
                </h1>
                <p className="text-gray-600">
                  Enter your credentials to access your Student dashboard
                </p>
              </div>

              <div className="space-y-6">
                {/* Email Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      error={!!emailError}
                      disabled={isLoading}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        error={!!passwordError}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                  {/* Google Login Button */}
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginError}
                      useOneTap={false}
                      shape="rectangular"
                      theme="outline"
                      size="large"
                      text="signin_with"
                      width="100%"
                    />
                  </div>
                </form>
              </div>

              <div className="text-center mt-8">
                <p className="text-sm text-gray-600">
                  Not registered yet?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </MarketingLayout>
  );
};

export default LoginPage;