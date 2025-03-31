
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid2X2, Layers, Layout, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface GalleryControlsProps {
  viewMode: "grid" | "stack" | "carousel";
  onChangeViewMode: (mode: "grid" | "stack" | "carousel") => void;
}

const GalleryControls: React.FC<GalleryControlsProps> = ({ viewMode, onChangeViewMode }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload photos",
          variant: "destructive"
        });
        return;
      }
      
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `photos/${user.id}/${fileName}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);
      
      // Insert record into photos table
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          user_id: user.id,
          title: file.name.split('.')[0],
          image_url: publicUrl,
          likes: 0,
          comments: 0
        });
      
      if (dbError) throw dbError;
      
      toast({
        title: "Success!",
        description: "Photo uploaded successfully"
      });
      
      // Refresh photo data
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };
  
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
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full relative overflow-hidden"
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="h-4 w-4 border-t-2 border-primary rounded-full animate-spin" />
        ) : (
          <>
            <Upload className="h-5 w-5" />
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default GalleryControls;
