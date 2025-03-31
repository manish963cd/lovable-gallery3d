
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResizablePanel } from "@/components/ui/resizable";
import Navbar from "@/components/Navbar";
import FolderList from "@/components/FolderList";
import PhotoGallery from "@/components/PhotoGallery";
import GalleryControls from "@/components/GalleryControls";
import MusicPlayer from "@/components/MusicPlayer";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "stack" | "carousel">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
  const folderId = searchParams.get('folder') || undefined;
  const isMobile = useIsMobile();

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Set dark mode by default (can be toggled in navbar)
    document.documentElement.classList.add('dark');
    
    // Auto-close sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    return () => clearTimeout(timer);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMusicPlayer = () => {
    setIsMusicPlayerOpen(!isMusicPlayerOpen);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 0, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="text-4xl font-bold text-primary mb-4"
        >
          Lovable.ai
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="h-1 bg-gradient-to-r from-gallery-primary to-gallery-accent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar 
        onToggleSidebar={toggleSidebar} 
        onToggleMusicPlayer={toggleMusicPlayer}
        isMusicPlayerOpen={isMusicPlayerOpen}
      />
      
      <div className="flex-1 pt-16 flex relative">
        {/* Mobile: Sidebar in Sheet */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="fixed bottom-24 left-4 z-30 rounded-full shadow-lg bg-primary text-white border-none"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <FolderList />
            </SheetContent>
          </Sheet>
        )}
        
        {/* Desktop: Animated Sidebar */}
        {!isMobile && (
          <AnimatePresence initial={false}>
            {isSidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 256, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="glass border-r border-white/10 h-full overflow-hidden"
              >
                <FolderList />
              </motion.aside>
            )}
          </AnimatePresence>
        )}
        
        {/* Main content */}
        <motion.main
          layout
          className="flex-1 h-full"
        >
          <PhotoGallery viewMode={viewMode} folderId={folderId} />
          <GalleryControls viewMode={viewMode} onChangeViewMode={setViewMode} />
        </motion.main>
        
        {/* Bottom Music Drawer for Mobile */}
        {isMobile && (
          <Drawer open={isMusicPlayerOpen} onOpenChange={setIsMusicPlayerOpen}>
            <DrawerContent className="px-4 pb-6 pt-2">
              <div className="flex justify-center mb-2">
                <div className="h-1 w-10 bg-muted rounded-full" />
              </div>
              <div className="flex flex-col gap-4">
                <MusicPlayer expanded={true} />
              </div>
            </DrawerContent>
          </Drawer>
        )}
        
        {/* Fixed Position Music Player for Desktop */}
        {!isMobile && (
          <MusicPlayer />
        )}
      </div>
    </div>
  );
};

export default Index;
