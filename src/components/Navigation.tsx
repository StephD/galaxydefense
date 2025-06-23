
import { useState } from "react";
import { Link } from "react-router-dom";
import { Database, Home, Cpu, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginModal from "./LoginModal";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };
  return (
    <>
      <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
                <span>Galaxy Defense</span>
              </Link>
              
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
            </div>
            
            <div>
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
          </div>
        </div>
      </nav>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onOpenChange={setIsLoginModalOpen} 
      />
    </>
  );
};

export default Navigation;
