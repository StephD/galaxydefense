
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Gamepad2 } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Gamepad2 className="h-16 w-16 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Hi, Gamers!
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Welcome to the ultimate community hub for your favorite game. 
            Connect, explore, and discover everything you need to know.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/features" className="flex items-center space-x-2">
                <span>Explore Features</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
