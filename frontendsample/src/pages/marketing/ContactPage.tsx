import React, { useState } from 'react';
import axios from 'axios';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    topic: 'general',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      topic: value
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      topic: 'general',
      message: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Sending contact form data:', formData);
      
      // Use Vite environment variable syntax
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await axios.post(`${API_BASE_URL}/contact`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('Response:', response.data);
      const result = response.data;

      if (result.success) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        });
        
        // Reset form
        resetForm();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      
      let errorMessage = "Network error. Please check your connection and try again.";
      
      if (error.response) {
        // Server responded with error status
        console.error('Response error:', error.response.data);
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.error('Request error:', error.request);
        errorMessage = "Cannot connect to server. Please check if backend is running on port 5000.";
      } else {
        // Something else happened
        console.error('Error message:', error.message);
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MarketingLayout>
      <div className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
              <p className="text-xl text-gray-600">
                Have questions or need help? Our team is here for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          placeholder="First Name" 
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          placeholder="Last Name" 
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          required 
                        />
                      </div>
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="companyName">Student Name</Label>
                      <Input 
                        id="companyName" 
                        name="companyName"
                        placeholder="Student Name" 
                        value={formData.companyName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div> */}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Student Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="Student Email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      {/* <Label htmlFor="topic">Topic</Label> */}
                      <Select 
                        value={formData.topic} 
                        onValueChange={handleSelectChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Topics</SelectItem>
                          <SelectItem value="admission">Admission Inquiry</SelectItem>
                          <SelectItem value="merit">Merit Question</SelectItem>
                          <SelectItem value="fees">Fee Structure</SelectItem>
                          <SelectItem value="discipline">Discipline Information</SelectItem>
                          <SelectItem value="partnership">University Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message"
                        placeholder="How can we help you?" 
                        rows={5} 
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        required 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-3 inline-flex items-center">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"></svg>
                          </span>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <div className="bg-primary-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="h-6 w-6 text-primary-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium">Email:</p>
                        <a href="mailto:mo733025@gmail.com" className="text-primary-600 hover:underline">mo733025@gmail.com</a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="h-6 w-6 text-primary-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="font-medium">WhatsApp: </p>
                        <a href="tel:+923020599969" className="text-primary-600 hover:underline">(+92) 3020599969</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Tips */}
                {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Get faster responses</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Be specific about your inquiry
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Include relevant details
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Choose the appropriate topic
                    </li>
                    <li className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      We typically respond within 24 hours
                    </li>
                  </ul>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default ContactPage;