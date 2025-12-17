import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Save, Mail, Shield } from 'lucide-react';
import emailjs from "@emailjs/browser";
import { Spinner } from '@/components/ui/spinner';

const AccountSettingsPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [authProvider, setAuthProvider] = useState('email');
  
  // PIN Modal states
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinSent, setPinSent] = useState(false);
  const [newEmailValue, setNewEmailValue] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No user session found');
      }

      const parsed = JSON.parse(storedUser);
      const userData = parsed.data || {};
      const studentId = userData._id;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/company/profile?studentId=${encodeURIComponent(
          studentId
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCompanyName(data.data.studentName || '');
          setEmail(data.data.email || '');
          setAuthProvider(data.data.authProvider || 'email');
          setInitialLoading(false);
          return;
        }
      }

      // Fallback to local user data if API fails
      setCompanyName(
        userData.student_name || userData.name || ''
      );
      setEmail(
        userData.student_email || userData.email || ''
      );
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data.',
        variant: 'destructive'
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleUpdateCompanyName = async () => {
    
    if (!companyName.trim()) {
      toast({
        title: 'Error',
        description: 'Student name cannot be empty.',
        variant: 'destructive'
      });
      return;
    }

    setNameLoading(true);

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No user session found');
      }
      const parsed = JSON.parse(storedUser);
      const userData = parsed.data || {};

      const response = await fetch(`${import.meta.env.VITE_API_URL}/company/profile/update-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: userData._id,
          companyName: companyName.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Success',
          description: 'Student name updated successfully.'
        });
      } else {
        throw new Error(data.message || 'Failed to update Student name');
      }
    } catch (error) {
      console.error('Error updating Student name:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update Student name.',
        variant: 'destructive'
      });
    } finally {
      setNameLoading(false);
    }
  };

  // Updated email update function to open PIN modal
  const handleUpdateEmail = async () => {
    
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Email address cannot be empty.',
        variant: 'destructive'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }

    // Store the new email value and open modal
    setNewEmailValue(email.trim());
    setShowPinModal(true);
    setPinSent(false);
    setPinCode('');
  };

  // Generate and send PIN
  const generateAndSendPin = async () => {
    setPinLoading(true);
    
    try {
      // Generate 6 digit PIN
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedPin(pin);

    
      await emailjs.send(
        "service_mz4y2ep", 
        "template_qngarip", 
        {
          to_email: newEmailValue,
          to_name: companyName || "User",
          pin_code: pin,
        },
        "PC68xGq2t9ivv3MXw" 
      );

      setPinSent(true);
      toast({
        title: 'PIN Sent!',
        description: `Verification code sent to ${newEmailValue}`,
      });

      console.log('=================================');
      console.log('EMAIL VERIFICATION PIN SENT:');
      console.log('Email:', newEmailValue);
      console.log('PIN:', pin);
      console.log('=================================');

    } catch (error) {
      console.error('Error sending PIN:', error);
      toast({
        title: 'Error',
        description: 'Failed to send verification code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPinLoading(false);
    }
  };

  // Verify PIN and update email
  const verifyPinAndUpdateEmail = async () => {
    if (!pinCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter the verification code.',
        variant: 'destructive'
      });
      return;
    }

    if (pinCode.trim() !== generatedPin) {
      toast({
        title: 'Error',
        description: 'Invalid verification code. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    setPinLoading(true);

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No user session found');
      }
      const parsed = JSON.parse(storedUser);
      const userData = parsed.data || {};

      const response = await fetch(`${import.meta.env.VITE_API_URL}/company/profile/update-email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: userData._id,
          email: newEmailValue
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Success',
          description: 'Email address updated successfully.'
        });

        // Close modal and reset states
        setShowPinModal(false);
        setPinCode('');
        setPinSent(false);
        setNewEmailValue('');
        setGeneratedPin('');
        
      } else {
        throw new Error(data.message || 'Failed to update email address');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update email address.',
        variant: 'destructive'
      });
    } finally {
      setPinLoading(false);
    }
  };

  const handleChangePassword = async () => {
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive'
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        throw new Error('No user session found');
      }
      const parsed = JSON.parse(storedUser);
      const userData = parsed.data || {};

      const response = await fetch(`${import.meta.env.VITE_API_URL}/company/password/change`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: userData._id,
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Success',
          description: 'Password changed successfully.'
        });
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password.',
        variant: 'destructive'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile information and security settings.</p>
      </div>

      {/* Company Name */}
      <Card>
        <CardHeader>
          <CardTitle>Student Name</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Student Name</Label>
              <Input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter Student name"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleUpdateCompanyName} disabled={nameLoading}>
                <Save className="w-4 h-4 mr-2" />
                {nameLoading ? 'Updating...' : 'Update Name'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Address */}
      <Card>
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleUpdateEmail} disabled={emailLoading}>
                <Save className="w-4 h-4 mr-2" />
                {emailLoading ? 'Updating...' : 'Update Email'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Password Change - Only show for email auth */}
      {authProvider === 'email' && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={passwordLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Google Auth Message */}
      {authProvider === 'google' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-600">
              <p>You are signed in with Google. Password change is not available for Google authenticated accounts.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PIN Verification Modal */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Email Verification
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                We need to verify your new email address:
              </p>
              <p className="font-medium text-gray-900">{newEmailValue}</p>
            </div>

            {!pinSent ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Click below to send a 6-digit verification code to your new email address.</span>
                </div>
                
                <Button 
                  onClick={generateAndSendPin} 
                  disabled={pinLoading}
                  className="w-full"
                >
                  {pinLoading ? 'Sending...' : 'Generate PIN to Change Email'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg text-center">
                   Verification code sent to {newEmailValue}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pinCode">Enter Verification Code</Label>
                  <Input
                    id="pinCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={verifyPinAndUpdateEmail} 
                    disabled={pinLoading || pinCode.length !== 6}
                    className="flex-1"
                  >
                    {pinLoading ? 'Verifying...' : 'Verify & Update Email'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={generateAndSendPin}
                    disabled={pinLoading}
                  >
                    Resend
                  </Button>
                </div>
              </div>
            )}

            <Button 
              variant="ghost" 
              onClick={() => {
                setShowPinModal(false);
                setPinCode('');
                setPinSent(false);
                setNewEmailValue('');
                setGeneratedPin('');
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountSettingsPage;