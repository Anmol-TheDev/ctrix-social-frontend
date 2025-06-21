// types.ts (optional: good for reusability)
export type User = {
  userName: string;
  userEmail: string;
  userAvatar: string;
  isLoggedIn: boolean;
};

export type UserProfile = {
  userBio: string;
  followers: string[];
  following: string[];
  postCount: number;
  bio: string;
};
export interface feedPost {
  id: string;
  creator_id: string;
  created_at: string;
  group_id: string;
  updated_at: string;
  text_content: string;
  media_attached: string[];
  username: string;
  avatar: string
  verified_user: boolean;
  bio: string;
}
export interface Comment {
  id: string;
  username: string;
  avatar?: string;
  content: string;
  giff: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  postId: string;
  verifiedUser: boolean;
}

