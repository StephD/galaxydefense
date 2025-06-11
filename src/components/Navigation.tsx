
import { Link } from "react-router-dom";
import { Database, Home } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
            <Home className="h-6 w-6" />
            <span>GameHub</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/features" 
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
            >
              <Database className="h-4 w-4" />
              <span>Features</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
