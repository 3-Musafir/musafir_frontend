import api from "@/pages/api";
import { IUser } from "./types/user";

export class UserService {
  static async getUnverifiedUsers(search?: string): Promise<IUser[]> {
    const data = await api.get(
      "/user/unverified-users",
      { search }
    );
    return data;
  }

  static async getVerifiedUsers(search?: string): Promise<IUser[]> {
    const data = await api.get(
      "/user/verified-users",
      { search }
    );
    return data;
  }

  static async getPendingVerificationUsers(search?: string): Promise<IUser[]> {
    const data = await api.get(
      "/user/pending-verification-users",
      { search }
    );
    return data;
  }

  static async searchAllUsers(search: string): Promise<{
    unverified: IUser[];
    pendingVerification: IUser[];
    verified: IUser[];
  }> {
    const data = await api.get(
      "/user/search-users",
      { search }
    );
    return data;
  }

  static async approveUser(userId: string) {
    const data = await api.patch(
      `/user/approve/${userId}`
    );
    return data;
  }

  static async rejectUser(userId: string) {
    const data = await api.patch(
      `/user/reject/${userId}`
    );
    return data;
  }

  static async getUserById(userId: string): Promise<IUser> {
    const data = await api.get(
      `/user/user-details/${userId}`
    );
    return data;
  }
}
