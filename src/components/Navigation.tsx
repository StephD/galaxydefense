
import { Link } from "react-router-dom";
import { Database, Home } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
            <svg className="h-6 w-6" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="256" cy="256" r="70" fill="currentColor" opacity="0.8"/>
              <circle cx="256" cy="256" r="100" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 5" opacity="0.8"/>
            </svg>
            <span>Galaxy Defense</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/database" 
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors duration-200"
            >
              <Database className="h-4 w-4" />
              <span>Database</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
