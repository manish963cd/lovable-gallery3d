
import { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, PerspectiveCamera } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import PhotoCard from "./PhotoCard";
import * as THREE from "three";

// Sample photo data
const samplePhotos = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1499856871958-5b9357976b82",
    title: "Sunset at the Beach",
    description: "Beautiful sunset over the ocean",
    location: "Malibu, CA",
    likes: 124,
    comments: 23,
    user: {
      name: "Jessica Parker",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    date: "2 days ago",
    isLiked: true,
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    title: "Mountain Range",
    description: "Epic mountain landscape during sunrise",
    location: "Swiss Alps",
    likes: 98,
    comments: 12,
    user: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    date: "1 week ago",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a",
    title: "Urban Adventure",
    description: "Cityscape from the rooftop",
    location: "New York, NY",
    likes: 156,
    comments: 31,
    user: {
      name: "Michael Wong",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    date: "3 days ago",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a",
    title: "Forest Exploration",
    description: "Misty forest in the early morning",
    location: "Redwood Forest, CA",
    likes: 84,
    comments: 8,
    user: {
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    date: "5 days ago",
    isLiked: true,
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
    title: "Italian Adventure",
    description: "Beautiful view of the coast",
    location: "Cinque Terre, Italy",
    likes: 215,
    comments: 42,
    user: {
      name: "David Kim",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    date: "1 day ago",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2",
    title: "Desert Oasis",
    description: "Stunning rock formations in the desert",
    location: "Antelope Canyon, AZ",
    likes: 176,
    comments: 19,
    user: {
      name: "Sophia Martinez",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    date: "4 days ago",
  },
];

// Frame component for 3D rendering of photos
const Frame = ({ position, rotation, url, onClick }: any) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (mesh.current && hovered) {
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, rotation[1] + 0.1, 0.1);
    } else if (mesh.current) {
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, rotation[1], 0.1);
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh
        ref={mesh}
        position={position}
        rotation={rotation}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        <boxGeometry args={[1.5, 1.5, 0.1]} />
        <meshStandardMaterial color="#fff" metalness={0.5} roughness={0.5} />
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshBasicMaterial map={new THREE.TextureLoader().load(url)} />
        </mesh>
      </mesh>
    </Float>
  );
};

// Main 3D Scene component
const Scene = ({ photos, onSelectPhoto }: { photos: any[], onSelectPhoto: (id: string) => void }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls 
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      
      <Environment preset="city" />
      
      {photos.map((photo, index) => {
        const theta = (index / photos.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        
        return (
          <Frame
            key={photo.id}
            position={[x, 0, z]}
            rotation={[0, -theta + Math.PI, 0]}
            url={photo.src}
            onClick={() => onSelectPhoto(photo.id)}
          />
        );
      })}
    </>
  );
};

// Grid view component
const GridView = ({ photos }: { photos: any[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {photos.map((photo, index) => (
        <PhotoCard key={photo.id} photo={photo} index={index} />
      ))}
    </div>
  );
};

// Stack view component
const StackView = ({ photos }: { photos: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };
  
  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 flex items-center">
        <button 
          className="glass absolute left-4 z-10 p-2 rounded-full text-foreground" 
          onClick={prevPhoto}
        >
          ←
        </button>
        <button 
          className="glass absolute right-4 z-10 p-2 rounded-full text-foreground" 
          onClick={nextPhoto}
        >
          →
        </button>
      </div>
      
      <div className="relative w-full max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <PhotoCard photo={photos[currentIndex]} index={0} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Main PhotoGallery component
interface PhotoGalleryProps {
  viewMode: "grid" | "stack" | "carousel";
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ viewMode }) => {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  
  const handleSelectPhoto = (id: string) => {
    setSelectedPhotoId(id);
  };
  
  return (
    <div className="w-full h-full">
      {viewMode === "grid" && (
        <ScrollArea className="w-full h-full">
          <GridView photos={samplePhotos} />
        </ScrollArea>
      )}
      
      {viewMode === "stack" && (
        <StackView photos={samplePhotos} />
      )}
      
      {viewMode === "carousel" && (
        <div className="w-full h-full">
          <Canvas shadows>
            <Suspense fallback={null}>
              <Scene 
                photos={samplePhotos} 
                onSelectPhoto={handleSelectPhoto}
              />
            </Suspense>
          </Canvas>
          
          {selectedPhotoId && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPhotoId(null)}
            >
              <motion.div
                className="w-full max-w-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <PhotoCard 
                  photo={samplePhotos.find(p => p.id === selectedPhotoId) || samplePhotos[0]} 
                  index={0} 
                />
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
