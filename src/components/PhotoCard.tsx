
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Download, 
  MoreHorizontal,
  MapPin 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PhotoCardProps {
  photo: {
    id: string;
    src: string;
    title: string;
    description?: string;
    location?: string;
    likes: number;
    comments: number;
    user: {
      name: string;
      avatar?: string;
    };
    date: string;
    isLiked?: boolean;
  };
  index: number;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, index }) => {
  const [isLiked, setIsLiked] = useState(photo.isLiked || false);
  const [likeCount, setLikeCount] = useState(photo.likes);
  const [isHovered, setIsHovered] = useState(false);

  const toggleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden backdrop-blur-md bg-card/30 border border-white/10">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square">
          <motion.img
            src={photo.src}
            alt={photo.title}
            className="w-full h-full object-cover transition-transform"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Hover overlay with actions */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-white mb-1">
              <h3 className="font-medium text-lg">{photo.title}</h3>
              {photo.location && (
                <div className="flex items-center text-xs opacity-80">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{photo.location}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={photo.user.avatar} alt={photo.user.name} />
                  <AvatarFallback className="text-xs">{photo.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-white/80">{photo.user.name}</span>
              </div>
              <span className="text-xs text-white/60">{photo.date}</span>
            </div>
          </motion.div>
        </div>
        
        {/* Card footer with actions */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={toggleLike}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isLiked ? "fill-gallery-accent text-gallery-accent" : ""
                  )}
                />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-1 text-xs font-medium">
            {likeCount} likes · {photo.comments} comments
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PhotoCard;
