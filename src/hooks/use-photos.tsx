
import { useState, useEffect } from 'react';
import { supabase, PhotoType, UserType } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export type EnhancedPhotoType = PhotoType & {
  user: {
    name: string;
    avatar: string | null;
  };
  date: string;
  isLiked?: boolean;
};

// Get all photos
export const usePhotos = (folderId?: string) => {
  return useQuery({
    queryKey: ['photos', folderId],
    queryFn: async (): Promise<EnhancedPhotoType[]> => {
      try {
        // Base query for photos
        let query = supabase.from('photos').select('*');
        
        // If folder ID is provided, filter by folder
        if (folderId) {
          query = query.eq('folder_id', folderId);
        }
        
        const { data: photos, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Get all unique user IDs from photos
        const userIds = [...new Set(photos.map(photo => photo.user_id))];
        
        // Fetch user details for all photos at once
        const { data: users } = await supabase
          .from('users')
          .select('*')
          .in('id', userIds);
        
        // Map users to a dictionary for quick lookup
        const userMap = (users || []).reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as Record<string, UserType>);
        
        // Get current user's likes
        const { data: currentUser } = await supabase.auth.getUser();
        let userLikes: Record<string, boolean> = {};
        
        if (currentUser?.user) {
          const { data: likes } = await supabase
            .from('likes')
            .select('photo_id')
            .eq('user_id', currentUser.user.id);
          
          userLikes = (likes || []).reduce((acc, like) => {
            acc[like.photo_id] = true;
            return acc;
          }, {} as Record<string, boolean>);
        }
        
        // Format the photos with user information and like status
        return photos.map(photo => {
          const user = userMap[photo.user_id];
          return {
            ...photo,
            user: {
              name: user?.name || 'Unknown User',
              avatar: user?.avatar_url
            },
            date: formatDate(photo.created_at),
            isLiked: userLikes[photo.id] || false
          };
        });
      } catch (error) {
        console.error('Error fetching photos:', error);
        return [];
      }
    },
  });
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString();
};

// Get a single photo by ID
export const usePhoto = (id: string) => {
  return useQuery({
    queryKey: ['photo', id],
    queryFn: async (): Promise<EnhancedPhotoType | null> => {
      try {
        const { data: photo, error } = await supabase
          .from('photos')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        if (!photo) return null;
        
        // Get user information
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', photo.user_id)
          .single();
        
        // Check if current user has liked this photo
        const { data: currentUser } = await supabase.auth.getUser();
        let isLiked = false;
        
        if (currentUser?.user) {
          const { data: like } = await supabase
            .from('likes')
            .select('*')
            .eq('photo_id', id)
            .eq('user_id', currentUser.user.id)
            .maybeSingle();
          
          isLiked = !!like;
        }
        
        return {
          ...photo,
          user: {
            name: user?.name || 'Unknown User',
            avatar: user?.avatar_url
          },
          date: formatDate(photo.created_at),
          isLiked
        };
      } catch (error) {
        console.error('Error fetching photo:', error);
        return null;
      }
    },
  });
};
