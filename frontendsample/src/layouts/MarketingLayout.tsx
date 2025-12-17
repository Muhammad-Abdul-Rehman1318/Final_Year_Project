import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import mylogo from '@/assets/mylogo.png';

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const NavLink = ({ to, children, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block font-semibold text-sm ${
        isActive
          ? 'text-[hsl(189.1,100%,34.9%)]'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
};

type MarketingLayoutProps = {
  children: React.ReactNode;
};

const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src={mylogo}
                  alt="University Finder logo"
                  className="h-[3.25rem] w-auto"
                />
              </Link>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/how-it-works">How It Works</NavLink>
              {/* <NavLink to="/pricing">Pricing</NavLink> */}
              <NavLink to="/contact">Contact</NavLink>
              {/* <NavLink to="/request-demo">Request Demo</NavLink> */}

              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with animation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-4 space-y-4 border-t border-gray-200 bg-white">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</NavLink>
            <NavLink to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</NavLink>
            <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
            <NavLink to="/request-demo" onClick={() => setMobileMenuOpen(false)}>Request Demo</NavLink>

            <div className="flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Our Process</h3>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link></li>
              </ul>
            </div>

            {/* <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Want us to Demo you?</h3>
              <ul className="space-y-2">
                <li><Link to="/request-demo" className="text-gray-600 hover:text-gray-900">Request Demo</Link></li>
              </ul>
            </div> */}

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Contact</h3>
              <p className="text-gray-600 mb-4">Get in touch with our team for any inquiries.</p>
              <Link to="/contact">
                <Button variant="outline" size="sm">Contact Us</Button>
              </Link>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 text-sm">&copy; 2025 AwamAssist. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
