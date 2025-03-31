
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MusicPlayerProps {
  expanded?: boolean;
}

const MusicPlayer = ({ expanded = false }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const isMobile = useIsMobile();
  
  // Update expanded state when prop changes
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);
  
  // Mock song data
  const song = {
    title: "Endless Summer",
    artist: "Dream Wave",
    duration: 237, // in seconds
    cover: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?auto=format&fit=crop&q=80&w=200&h=200"
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle player expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Auto increment current time when playing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying && currentTime < song.duration) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
          return newTime <= song.duration ? newTime : prevTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, song.duration]);

  // Mobile version (used in drawer)
  if (isMobile && expanded) {
    return (
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">{song.title}</h3>
              <p className="text-muted-foreground">{song.artist}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Slider
            value={[currentTime]}
            max={song.duration}
            step={1}
            onValueChange={(vals) => setCurrentTime(vals[0])}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(song.duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-6">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
            <SkipBack className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-16 w-16 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full">
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 mt-6">
          <Volume2 className="h-5 w-5 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(vals) => setVolume(vals[0])}
            className="flex-1"
          />
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "fixed bottom-4 right-4 z-40 glass rounded-full shadow-lg transition-all duration-300",
          isExpanded ? "w-72 rounded-xl" : "w-14 h-14"
        )}
        layout
        animate={{ y: 0 }}
        initial={{ y: 100 }}
        exit={{ y: 100 }}
      >
        {/* Collapsed state - just icon */}
        {!isExpanded && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-14 h-14 rounded-full" 
            onClick={toggleExpanded}
          >
            <Music className="h-6 w-6 text-primary" />
          </Button>
        )}
        
        {/* Expanded state - full player */}
        {isExpanded && (
          <div className="p-3">
            <div className="flex items-center space-x-3 mb-3">
              {/* Album art */}
              <motion.div 
                className="w-12 h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={song.cover} 
                  alt={song.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Song info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{song.title}</p>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
              
              {/* Close button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={toggleExpanded}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="mb-1 px-1">
              <Slider
                value={[currentTime]}
                max={song.duration}
                step={1}
                onValueChange={(vals) => setCurrentTime(vals[0])}
                className="mb-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(song.duration)}</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-10 w-10 rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Volume */}
              <div className="flex items-center space-x-2">
                <Volume2 className="h-3 w-3 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={(vals) => setVolume(vals[0])}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MusicPlayer;
