
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Upload, FolderPlus, Settings, LogOut, Menu, X, Music } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onToggleSidebar?: () => void;
  onToggleMusicPlayer?: () => void;
  isMusicPlayerOpen?: boolean;
}

const Navbar = ({ onToggleSidebar, onToggleMusicPlayer, isMusicPlayerOpen }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass px-4 py-2"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle for desktop */}
          {!isMobile && onToggleSidebar && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleSidebar}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <motion.div
            className="text-2xl font-bold text-gallery-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Lovable.ai
          </motion.div>
        </div>
        
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        <div className={cn(
          "fixed md:static top-16 right-0 left-0 bg-background/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-0 p-4 md:p-0 transition-all duration-300 ease-in-out",
          isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto",
          "md:flex md:items-center md:space-x-4"
        )}>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Upload size={18} />
            <span className="md:hidden lg:inline">Upload</span>
          </Button>
          
          <Button variant="ghost" className="flex items-center space-x-2">
            <FolderPlus size={18} />
            <span className="md:hidden lg:inline">New Folder</span>
          </Button>
          
          {/* Music player toggle button */}
          <Button 
            variant={isMusicPlayerOpen ? "secondary" : "ghost"}
            size="icon"
            onClick={onToggleMusicPlayer}
            className="flex items-center"
          >
            <Music size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="ml-2"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>{user?.email.substring(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              {user?.email && <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>My Gallery</DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
