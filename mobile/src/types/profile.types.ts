export interface UserProfile {
    id: string;
    username: string;
    email: string;
    displayName: string;
    profileImage: string | null;
    bio: string | null;
    createdAt: string;
  
    threadsCount: number;
    repliesCount: number;
    reactionsCount: number;
  }
  
  export interface GetProfileResponse {
    success: boolean;
    message: string;
    data: UserProfile;
  }
  
  export interface UpdateProfileRequest {
    displayName: string;
    bio?: string;
  }