
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Database, Home, Cpu, LogIn, LogOut, Menu, X, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginModal from "./LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading, isAdmin } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };
  
  // Close mobile menu when clicking outside or on navigation links
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('#mobile-menu') && 
          !(event.target as Element).closest('#burger-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Admin status is now managed by AuthContext
  return (
    <>
      <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
                <span>Galaxy Defense</span>
              </Link>
              
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/cards" 
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                >
                  <Database className="h-4 w-4" />
                  <span>Cards</span>
                </Link>
                <Link 
                  to="/chips" 
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                >
                  <Cpu className="h-4 w-4" />
                  <span>Chips</span>
                </Link>
                {isAuthenticated && (
                  <>
                    <Link 
                      to="/reports" 
                      className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Reports</span>
                    </Link>
                    <Link 
                      to="/boosters" 
                      className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
                    >
                      <Users className="h-4 w-4" />
                      <span>Boosters</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">Welcome, {user.email?.split('@')[0]}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center space-x-2"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2"
                  onClick={() => setIsLoginModalOpen(true)}
                  disabled={isLoading}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>
            
            {/* Mobile Burger Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                id="burger-button"
                className="p-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="fixed inset-0 top-16 z-50 md:hidden bg-white/95 dark:bg-gray-900/95 border-t shadow-lg "
          >
            <div className="container pt-2 mx-auto px-4 py-6 flex flex-col space-y-6 relative z-10 bg-background border-b shadow-sm">
            <div className="flex flex-col ">
              <Link 
                to="/cards" 
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-secondary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Database className="h-5 w-5" />
                <span className="text-lg">Cards</span>
              </Link>
              <Link 
                to="/chips" 
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-secondary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Cpu className="h-5 w-5" />
                <span className="text-lg">Chips</span>
              </Link>
              
                <Link 
                  to="/reports" 
                  className="flex items-center space-x-3 p-3 rounded-md hover:bg-secondary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-lg">Reports</span>
                </Link>
                <Link 
                  to="/boosters" 
                  className="flex items-center space-x-3 p-3 rounded-md hover:bg-secondary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-lg">Boosters</span>
                </Link>
            </div>
            
            <div className="pt-4 border-t border-border">
              {isAuthenticated && user ? (
                <div className="flex flex-col space-y-4">
                  <span className="text-sm text-muted-foreground">Welcome, {user.email?.split('@')[0]}</span>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center space-x-2 w-full"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center space-x-2 w-full"
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoading}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        )}
      </nav>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onOpenChange={setIsLoginModalOpen} 
      />
    </>
  );
};

export default Navigation;
