
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ResizablePanel } from "@/components/ui/resizable";
import Navbar from "@/components/Navbar";
import FolderList from "@/components/FolderList";
import PhotoGallery from "@/components/PhotoGallery";
import GalleryControls from "@/components/GalleryControls";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  const [viewMode, setViewMode] = useState<"grid" | "stack" | "carousel">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Set dark mode by default (can be toggled in navbar)
    document.documentElement.classList.add('dark');
    
    return () => clearTimeout(timer);
  }, []);

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
      <Navbar />
      
      <div className="flex-1 pt-16 flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass w-64 border-r border-white/10 hidden md:block"
        >
          <FolderList />
        </motion.aside>
        
        {/* Main content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 h-full"
        >
          <PhotoGallery viewMode={viewMode} />
          <GalleryControls viewMode={viewMode} onChangeViewMode={setViewMode} />
          <MusicPlayer />
        </motion.main>
      </div>
    </div>
  );
};

export default Index;
