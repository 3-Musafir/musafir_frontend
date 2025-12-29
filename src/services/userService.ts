import api from "@/pages/api";
import { IUser } from "./types/user";

export class UserService {
  static async getUnverifiedUsers(search?: string): Promise<IUser[]> {
    return api.get(`/user/unverified-users`, { search });
  }

  static async getVerifiedUsers(search?: string): Promise<IUser[]> {
    return api.get(`/user/verified-users`, { search });
  }

  static async getPendingVerificationUsers(search?: string): Promise<IUser[]> {
    return api.get(`/user/pending-verification-users`, { search });
  }

  static async searchAllUsers(search: string): Promise<{
    unverified: IUser[];
    pendingVerification: IUser[];
    verified: IUser[];
  }> {
    return api.get(`/user/search-users`, { search });
  }

  static async approveUser(userId: string) {
    return api.patch(`/user/approve/${userId}`);
  }

  static async rejectUser(userId: string) {
    return api.patch(`/user/reject/${userId}`);
  }

  static async getUserById(userId: string): Promise<IUser> {
    return api.get(`/user/user-details/${userId}`);
  }
}
