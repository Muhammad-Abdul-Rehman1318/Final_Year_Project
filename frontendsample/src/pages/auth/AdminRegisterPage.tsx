import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminRegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    admin_name: '',
    admin_email: '',
    password: '',
    confirmPassword: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_name: formData.admin_name,
          admin_email: formData.admin_email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Registration error",
          description: data.message || "Something went wrong",
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Your admin account has been created.",
        });
        navigate('/admin/login');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "An error occurred during registration.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
          <CardDescription>
            Create an account to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin_name">Full Name</Label>
              <Input
                id="admin_name"
                name="admin_name"
                placeholder="John Doe"
                value={formData.admin_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_email">Email</Label>
              <Input
                id="admin_email"
                name="admin_email"
                placeholder="admin@UniversityFinder.com"
                type="email"
                value={formData.admin_email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a 
              className="text-primary-600 hover:underline"
              href="/admin/login"
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin/login');
              }}
            >
              Sign in
            </a>
          </p>
          <p className="mt-2 text-xs text-center text-gray-500">
            Admin registration requires approval by the system administrator.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminRegisterPage;