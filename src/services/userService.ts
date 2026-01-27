import api from "@/pages/api";
import { IUser } from "./types/user";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserService {
  static async getUnverifiedUsers(search?: string): Promise<IUser[]> {
    return api.get(`/user/unverified-users`, { search });
  }

  static async getVerifiedUsers(
    search?: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<IUser> | IUser[]> {
    const params: any = {};
    if (search) params.search = search;
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;

    return api.get(`/user/verified-users`, params);
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

  static async updateVerificationStatus(
    userId: string,
    status: "verified" | "unverified",
    options?: { registrationId?: string; comment?: string }
  ): Promise<IUser> {
    const payload: any = { status };
    if (options?.comment) {
      payload.comment = options.comment;
    }
    if (options?.registrationId) {
      payload.registrationId = options.registrationId;
    }
    const res = await api.patch(`/user/verification-status/${userId}`, payload);
    // Backend wraps payload as { data, message, statusCode }
    return (res as any)?.data ?? res;
  }
}
