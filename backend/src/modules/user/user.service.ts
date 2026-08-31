import { AppError } from "../../errors/AppError.js";
import {
  findUserById,
  getUserProfile,
  updateUserProfile,
} from "./user.repository.js";
import {
  type UpdateProfileRequest,
  type UserProfileResponse,
} from "./user.types.js";

export async function getMyProfileService(
  userId: string
): Promise<{
  success: boolean;
  message: string;
  data: UserProfileResponse;
}> {
  const user = await getUserProfile(userId);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return {
    success: true,
    message: "Profile fetched successfully.",
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      profileImage: user.profileImage,
      bio: user.bio,
      createdAt: user.createdAt,

      threadsCount: user._count.threads,
      repliesCount: user._count.replies,
      reactionsCount: user._count.reactions,
    },
  };
}

export async function getUserProfileService(
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
    data: UserProfileResponse;
  }> {
    const user = await getUserProfile(userId);
  
    if (!user) {
      throw new AppError(404, "User not found.");
    }
  
    return {
      success: true,
      message: "Profile fetched successfully.",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt,
  
        threadsCount: user._count.threads,
        repliesCount: user._count.replies,
        reactionsCount: user._count.reactions,
      },
    };
  }

export async function updateMyProfileService(
  userId: string,
  data: UpdateProfileRequest
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  await updateUserProfile(userId, data);

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}