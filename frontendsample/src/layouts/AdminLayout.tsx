
import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Icons
import { 
  Home, 
  Users,
  Clock,
  Settings, 
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mock admin data
  const admin = {
    name: 'Admin User',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  };
  
 const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Universities', href: '/admin/companies', icon: Users },
  // { name: 'Demo Requests', href: '/admin/demo-requests', icon: Clock },
  { name: 'Contact Information', href: '/admin/contact-information', icon: Users },
];
  
  const handleLogout = () => {
    // In a real app, this would include auth logout logic
    navigate('/admin/login');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <div className={`${
        isSidebarOpen ? 'block' : 'hidden'
      } w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-10 flex-col hidden md:flex`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-primary-700">
          <span className="text-white text-xl font-bold">UniversityFinder Admin</span>
        </div>
        
        <div className="flex-grow p-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                    } mr-3 flex-shrink-0 h-5 w-5`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User menu */}
        <div className="flex items-center p-4 border-t border-gray-200">
          <div className="flex-shrink-0">
            <Avatar>
              <AvatarImage src={admin.avatar} />
              <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{admin.name}</p>
            <p className="text-xs font-medium text-gray-500">{admin.role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile sidebar (off-canvas) */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          {/* Sidebar panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="h-10 w-10 rounded-full flex items-center justify-center text-white"
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            
            <div className="flex-1 h-0 overflow-y-auto">
              <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-primary-700">
                <span className="text-white text-xl font-bold">UniversityFinder Admin</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* Mobile user menu */}
            <div className="flex items-center p-4 border-t border-gray-200">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarImage src={admin.avatar} />
                  <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                <p className="text-xs font-medium text-gray-500">{admin.role}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className={`flex-1 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Top header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden mr-2"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
              <h1 className="text-lg font-medium text-primary-800">Admin Dashboard</h1>
            </div>
            
            {/* Right side header content */}
            <div className="flex items-center space-x-4">
              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={admin.avatar} />
                      <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{admin.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
