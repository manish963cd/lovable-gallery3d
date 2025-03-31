
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid2X2, Layers, Layout } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GalleryControlsProps {
  viewMode: "grid" | "stack" | "carousel";
  onChangeViewMode: (mode: "grid" | "stack" | "carousel") => void;
}

const GalleryControls: React.FC<GalleryControlsProps> = ({ viewMode, onChangeViewMode }) => {
  return (
    <motion.div
      className="glass fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-2 py-1.5 flex items-center space-x-1"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Button
        variant={viewMode === "grid" ? "secondary" : "ghost"}
        size="icon"
        className={cn(
          "h-9 w-9 rounded-full",
          viewMode === "grid" ? "text-primary-foreground" : ""
        )}
        onClick={() => onChangeViewMode("grid")}
      >
        <Grid2X2 className="h-5 w-5" />
      </Button>
      
      <Button
        variant={viewMode === "stack" ? "secondary" : "ghost"}
        size="icon"
        className={cn(
          "h-9 w-9 rounded-full",
          viewMode === "stack" ? "text-primary-foreground" : ""
        )}
        onClick={() => onChangeViewMode("stack")}
      >
        <Layers className="h-5 w-5" />
      </Button>
      
      <Button
        variant={viewMode === "carousel" ? "secondary" : "ghost"}
        size="icon"
        className={cn(
          "h-9 w-9 rounded-full",
          viewMode === "carousel" ? "text-primary-foreground" : ""
        )}
        onClick={() => onChangeViewMode("carousel")}
      >
        <Layout className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};

export default GalleryControls;
