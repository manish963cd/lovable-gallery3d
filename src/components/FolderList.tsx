
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Folder, ChevronRight, ChevronDown, Plus, Image, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useSearchParams } from "react-router-dom";

interface FolderItem {
  id: string;
  name: string;
  type: "folder" | "collection";
  count: number;
  isExpanded?: boolean;
  children?: FolderItem[];
}

const initialFolders: FolderItem[] = [
  {
    id: "favorites",
    name: "Favorites",
    type: "collection",
    count: 24,
  },
  {
    id: "recent",
    name: "Recent",
    type: "collection",
    count: 16,
  },
  {
    id: "folder-1",
    name: "Vacation 2023",
    type: "folder",
    count: 43,
    isExpanded: false,
    children: [
      {
        id: "sub-folder-1",
        name: "Beach Day",
        type: "folder",
        count: 18,
      },
      {
        id: "sub-folder-2",
        name: "Mountain Trip",
        type: "folder",
        count: 25,
      },
    ],
  },
  {
    id: "folder-2",
    name: "Family",
    type: "folder",
    count: 76,
    isExpanded: false,
  },
  {
    id: "folder-3",
    name: "Projects",
    type: "folder",
    count: 29,
    isExpanded: false,
  },
];

const FolderList = () => {
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
  const [searchParams] = useSearchParams();
  const activeFolder = searchParams.get('folder') || "recent";
  const isMobile = useIsMobile();

  const toggleFolder = (folderId: string) => {
    setFolders(
      folders.map((folder) => {
        if (folder.id === folderId) {
          return { ...folder, isExpanded: !folder.isExpanded };
        }
        return folder;
      })
    );
  };

  const renderFolderItem = (folder: FolderItem, depth = 0) => {
    const isActive = activeFolder === folder.id;
    
    return (
      <motion.div 
        key={folder.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: depth * 0.1 }}
      >
        <Link to={`/?folder=${folder.id}`} className="block">
          <div 
            className={cn(
              "flex items-center py-2 px-3 rounded-md cursor-pointer transition-colors group",
              isActive 
                ? "bg-primary/20 text-primary font-medium" 
                : "hover:bg-muted"
            )}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            {folder.type === "folder" && folder.children && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 mr-1"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFolder(folder.id);
                }}
              >
                {folder.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <div className="flex items-center flex-1">
              {folder.type === "collection" && folder.id === "favorites" ? (
                <Heart className="h-4 w-4 mr-2 text-gallery-accent" />
              ) : folder.type === "collection" ? (
                <Image className="h-4 w-4 mr-2" />
              ) : (
                <Folder className="h-4 w-4 mr-2" />
              )}
              <span className="flex-1 truncate">{folder.name}</span>
              <span className="text-xs text-muted-foreground">{folder.count}</span>
            </div>
          </div>
        </Link>
        
        {folder.isExpanded &&
          folder.children?.map((child) =>
            renderFolderItem(child, depth + 1)
          )}
      </motion.div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 px-3 py-4">
        <h3 className="font-medium text-lg">Gallery</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-2 pb-4 space-y-1">
          {folders.map((folder) => renderFolderItem(folder))}
        </div>
      </ScrollArea>
      
      {isMobile && (
        <div className="p-4 mt-auto border-t border-muted">
          <Button variant="outline" className="w-full">
            <Upload size={16} className="mr-2" />
            Upload Photos
          </Button>
        </div>
      )}
    </div>
  );
};

export default FolderList;
