import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

const Navigation = () => {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold">Studio</Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#work" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Work
            </a>
            <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm" className="gap-2">
                        <User className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Get in Touch
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
