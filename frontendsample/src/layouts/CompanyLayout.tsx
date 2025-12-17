import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
// Icons
import { 
  Home, 
  FileText, 
  Users, 
  Calendar,
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import Loading from '@/components/ui/loading';

const CompanyLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load basic user info from localStorage (no JWT decoding)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const userData = parsed.data || {};

        const name =
          userData.student_name ||
          userData.name ||
          'Student';
        setCompanyName(name);
        setUserName(name);

        const roleFromData = userData.role || parsed.userType || 'Student';
        setUserRole(roleFromData);
      } catch (error) {
        console.error('Error reading stored user:', error);
        setCompanyName('Student');
        setUserName('User');
      }
    } else {
      setCompanyName('Student');
      setUserName('User');
    }
    setLoading(false);
  }, []);
  
  const navigation = [
    { name: 'Home', href: '/company/hero-section', icon: Home },
    { name: 'Favorites', href: '/company/favorites', icon: FileText },
    { name: 'Search Ranking', href: '/company/ranking-search', icon: Calendar },
    { name: 'Search disciplines', href: '/company/discipline-search', icon: Users },
    { name: 'Setting', href: '/company/settings', icon: Settings },
  ];

  const { toast } = useToast();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: 'Logout Successful',
      description: 'You have been logged out successfully.'
    });
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show loading state while fetching user data
  if (loading) {
    return <Loading message="Loading..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <div className={`${
        isSidebarOpen ? 'block' : 'hidden'
      } w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-10 flex-col hidden md:flex`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <span className="text-primary-600 text-xl font-bold"></span>
        </div>
        
        <div className="flex-grow p-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.name === 'Jobs' && location.pathname.startsWith('/company/jobs')) ||
                (item.name === 'Interviews' && location.pathname.startsWith('/company/interviews'));
              
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
        
        {/* User menu - FIXED */}
        <div className="flex items-center p-4 border-t border-gray-200">
          <div className="flex-shrink-0">
            <Avatar>
              <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{userName || 'User'}</p>
            <p className="text-xs font-medium text-gray-500">{userRole}</p>
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
              <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <span className="text-primary-600 text-xl font-bold">University Finder</span>
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
            
            {/* Mobile user menu - FIXED */}
            <div className="flex items-center p-4 border-t border-gray-200">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{userName || 'User'}</p>
                <p className="text-xs font-medium text-gray-500">{userRole}</p>
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
              <h1 className="text-lg font-medium">{companyName}</h1>
            </div>
            
            {/* Right side header content */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    <div className="py-2 px-3 text-sm">
                      <div className="font-medium">New candidate applied</div>
                      <div className="text-gray-500">John Doe applied for Frontend Developer</div>
                      <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="py-2 px-3 text-sm">
                      <div className="font-medium">Interview completed</div>
                      <div className="text-gray-500">Sarah Smith completed the interview</div>
                      <div className="text-xs text-gray-400 mt-1">Yesterday</div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-primary-600">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
              
              {/* User dropdown - FIXED */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{userName || 'User'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    {/* <Link to="/company/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account settings</span>
                    </Link> */}
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

export default CompanyLayout;