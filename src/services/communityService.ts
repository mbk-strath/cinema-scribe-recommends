
import { supabase } from '@/integrations/supabase/client';

export type Community = {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  cover_image_url: string | null;
  created_by: string;
  member_count: number;
  created_at: string;
  updated_at: string;
  user_is_member?: boolean;
};

export type CommunityPost = {
  id: string;
  community_id: string;
  user_id: string;
  title: string;
  content: string | null;
  media_id: string | null;
  media_type: 'book' | 'movie' | null;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    avatar_url: string | null;
  };
  community?: {
    name: string;
    display_name: string;
  };
  user_vote?: 'upvote' | 'downvote' | null;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    avatar_url: string | null;
  };
};

// Community functions
export const getCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from('communities' as any)
    .select('*')
    .order('member_count', { ascending: false });
  
  if (error) throw error;
  return (data || []) as Community[];
};

export const getCommunityById = async (id: string): Promise<Community | null> => {
  const { data, error } = await supabase
    .from('communities' as any)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Community;
};

export const createCommunity = async (community: Omit<Community, 'id' | 'created_at' | 'updated_at' | 'member_count'>) => {
  const { data, error } = await supabase
    .from('communities' as any)
    .insert(community as any)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const joinCommunity = async (communityId: string, userId: string) => {
  const { data, error } = await supabase
    .from('community_members' as any)
    .insert({
      community_id: communityId,
      user_id: userId,
      role: 'member'
    } as any)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  const { error } = await supabase
    .from('community_members' as any)
    .delete()
    .eq('community_id', communityId)
    .eq('user_id', userId);
  
  if (error) throw error;
};

// Post functions
export const getCommunityPosts = async (communityId?: string): Promise<CommunityPost[]> => {
  let query = supabase
    .from('community_posts' as any)
    .select(`
      *,
      profiles:user_id(username, avatar_url),
      communities:community_id(name, display_name)
    `)
    .order('created_at', { ascending: false });
  
  if (communityId) {
    query = query.eq('community_id', communityId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return (data || []).map((post: any) => ({
    ...post,
    user: post.profiles ? {
      username: post.profiles.username || 'Anonymous',
      avatar_url: post.profiles.avatar_url
    } : undefined,
    community: post.communities ? {
      name: post.communities.name,
      display_name: post.communities.display_name
    } : undefined
  })) as CommunityPost[];
};

export const createPost = async (post: Omit<CommunityPost, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes' | 'comment_count' | 'user' | 'community' | 'user_vote'>) => {
  const { data, error } = await supabase
    .from('community_posts' as any)
    .insert(post as any)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const voteOnPost = async (postId: string, userId: string, voteType: 'upvote' | 'downvote') => {
  // First, check if user already voted
  const { data: existingVote } = await supabase
    .from('post_votes' as any)
    .select('vote_type')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();
  
  if (existingVote) {
    if (existingVote.vote_type === voteType) {
      // Remove vote if clicking same vote
      const { error } = await supabase
        .from('post_votes' as any)
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } else {
      // Update vote if different
      const { error } = await supabase
        .from('post_votes' as any)
        .update({ vote_type: voteType } as any)
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (error) throw error;
    }
  } else {
    // Create new vote
    const { error } = await supabase
      .from('post_votes' as any)
      .insert({
        post_id: postId,
        user_id: userId,
        vote_type: voteType
      } as any);
    
    if (error) throw error;
  }
  
  // Update post vote counts
  const { data: votes } = await supabase
    .from('post_votes' as any)
    .select('vote_type')
    .eq('post_id', postId);
  
  const upvotes = votes?.filter((v: any) => v.vote_type === 'upvote').length || 0;
  const downvotes = votes?.filter((v: any) => v.vote_type === 'downvote').length || 0;
  
  const { error: updateError } = await supabase
    .from('community_posts' as any)
    .update({ upvotes, downvotes } as any)
    .eq('id', postId);
  
  if (updateError) throw updateError;
};

export const getPostComments = async (postId: string): Promise<PostComment[]> => {
  const { data, error } = await supabase
    .from('post_comments' as any)
    .select(`
      *,
      profiles:user_id(username, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  return (data || []).map((comment: any) => ({
    ...comment,
    user: comment.profiles ? {
      username: comment.profiles.username || 'Anonymous',
      avatar_url: comment.profiles.avatar_url
    } : undefined
  })) as PostComment[];
};

export const addComment = async (comment: Omit<PostComment, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes' | 'user'>) => {
  const { data, error } = await supabase
    .from('post_comments' as any)
    .insert(comment as any)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
