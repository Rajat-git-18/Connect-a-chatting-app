export interface UpdateProfileRequest {
    displayName: string;
    bio?: string;
  }
  
  export interface UserProfileResponse {
    id: string;
    username: string;
    email: string;
    displayName: string;
    profileImage: string | null;
    bio: string | null;
    createdAt: Date;
  
    threadsCount: number;
    repliesCount: number;
    reactionsCount: number;
  }