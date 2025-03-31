
import { createClient } from '@supabase/supabase-js';

// These variables will be replaced with your actual Supabase URL and anon key
// after connecting your Lovable project to Supabase
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types that match our Supabase schema
export type PhotoType = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  image_url: string;
  likes: number;
  comments: number;
};

export type UserType = {
  id: string;
  created_at: string;
  name: string;
  avatar_url: string | null;
};

export type LikeType = {
  id: string;
  created_at: string;
  user_id: string;
  photo_id: string;
};

export type CommentType = {
  id: string;
  created_at: string;
  user_id: string;
  photo_id: string;
  content: string;
};

export type FolderType = {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
};
