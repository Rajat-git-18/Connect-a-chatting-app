import api from "./client";
import {
  GetProfileResponse,
  UpdateProfileRequest,
  UserProfile,
} from "../../types/profile.types";

function unwrapProfile(body: GetProfileResponse | UserProfile): UserProfile {
  const profile = "data" in body && body.data ? body.data : (body as UserProfile);

  if (!profile?.id || !profile.email) {
    throw new Error("Profile response is missing email.");
  }

  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    displayName: profile.displayName,
    profileImage: profile.profileImage ?? null,
    bio: profile.bio ?? null,
    createdAt: profile.createdAt,
    threadsCount: profile.threadsCount ?? 0,
    repliesCount: profile.repliesCount ?? 0,
    reactionsCount: profile.reactionsCount ?? 0,
  };
}

// Get current user's profile
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get<GetProfileResponse>("/users/me");
  return unwrapProfile(response.data);
};

// Get another user's profile
export const getUserProfile = async (
  userId: string
): Promise<UserProfile> => {
  const response = await api.get<GetProfileResponse>(`/users/${userId}`);
  return response.data.data;
};

// Update profile
export const updateMyProfile = async (
  data: UpdateProfileRequest
) => {
  const response = await api.patch("/users/me", data);
  return response.data;
};