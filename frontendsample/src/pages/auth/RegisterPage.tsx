import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import MarketingLayout from "@/layouts/MarketingLayout";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form whenever fields change
  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail);
    const isPasswordValid = password.length >= 6;
    const isCompanyNameValid = studentName.trim().length > 0;

    setEmailError(
      isEmailValid || studentEmail.length === 0
        ? ""
        : "Please enter a valid email address"
    );
    setPasswordError(
      isPasswordValid || password.length === 0
        ? ""
        : "Password must be at least 6 characters"
    );

    setIsFormValid(isEmailValid && isPasswordValid && isCompanyNameValid);
  }, [studentName, studentEmail, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: studentName,
          student_email: studentEmail,
          password: password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Registration error",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      } else {
        // Store basic user session without JWT if backend returns user data
        if (data.data) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              userType: "student",
              data: data.data,
            })
          );
        }

        toast({
          title: "Registration successful!",
          description: data.message,
        });
        navigate("/company/hero-section");
      }
    } catch (error) {
      toast({
        title: "Registration error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsSubmitting(true);
      const decoded: any = jwtDecode(credentialResponse.credential);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/google-register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            google_token: credentialResponse.credential,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
            sub: decoded.sub,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Google registration error",
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

        const messageTitle = data.isExistingUser
          ? "Welcome back!"
          : "Registration successful!";
        const messageDescription = data.isExistingUser
          ? "You've been logged in to your existing account."
          : "Account created successfully with Google";

        toast({
          title: messageTitle,
          description: messageDescription,
        });

        navigate("/company/hero-section");
      }
    } catch (error) {
      console.error("Google registration error:", error);
      toast({
        title: "Google registration error",
        description: "Something went wrong during Google registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    toast({
      title: "Google login failed",
      description: "Please try again or use email registration",
      variant: "destructive",
    });
  };

  return (
    <MarketingLayout>
      <GoogleOAuthProvider clientId="554055055478-rknhms5v8p9k3gcn7dmjo18r9tp1lqvi.apps.googleusercontent.com">
        <div className="min-h-screen flex items-center justify-center bg-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {" "}
            {/* Adjusted width to prevent scrolling */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-semibold text-gray-700 mb-2">
                    Create account
                  </h1>
                  <p className="text-base text-gray-600">
                    Join University Finder to find the best candidates faster
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="studentName"
                      className="text-gray-600 font-bold"
                    >
                      Student Name
                    </Label>
                    <Input
                      id="studentName"
                      type="text"
                      placeholder="Enter Student name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      className="py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="studentEmail"
                      className="text-gray-600 font-bold"
                    >
                      Email
                    </Label>
                    <Input
                      id="studentEmail"
                      type="email"
                      placeholder="Enter email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                      error={!!emailError}
                      className="py-3"
                    />
                    {emailError && (
                      <p className="text-destructive text-sm mt-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-600 font-bold"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        error={!!passwordError}
                        className="py-3"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 text-base font-medium rounded-3xl"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create an Account"}
                </Button>

                <div className="flex justify-center">
                  <style>{`
                  .hJDwNd-SxQuSe, 
                  .nsm7Bb-HzV7m-LgbsSe {
                    border-radius: 20px !important;
                    width: 380px !important; 
                    max-width: 100% !important;
                  }
                  .nsm7Bb-HzV7m-LgbsSe-BPrWId {
                    font-weight: 600 !important;
                    font-size: 15px !important;
                  }
                `}</style>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    shape="rectangular"
                    theme="outline"
                    size="large"
                    text="signup_with"
                    width="400"
                    locale="en"
                    ux_mode="popup"
                  />
                </div>

                <div className="text-center pt-4">
                  <p className="text-gray-600 text-base">
                    Already have an account?{" "}
                    <Link
                      to="/company/hero-section"
                      className="text-primary-600 hover:underline font-semibold"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </MarketingLayout>
  );
};

export default RegisterPage;
