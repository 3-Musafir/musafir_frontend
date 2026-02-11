import api from "@/lib/api";
import { IRegistration, IPendingPaymentVerificationResponse } from "@/interfaces/trip/trip";
import { IFlagship, IRegistrationStats, IPaymentStats } from "./types/flagship";

export class FlagshipService {
  static async getRegisteredUsers(
    flagshipId: string,
    params?: {
      search?: string;
      verificationStatus?: string;
      rejectedOnly?: boolean;
      excludeVerificationStatus?: string;
      limit?: number;
      page?: number;
    },
  ): Promise<IRegistration[]> {
    return api.get(`/flagship/registered/${flagshipId}`, params || {});
  }

  static async getPendingVerificationUsers(
    flagshipId: string
  ): Promise<IRegistration[]> {
    return api.get(`/flagship/pending-verification/${flagshipId}`);
  }

  static async getPaidUsers(
    flagshipId: string,
    paymentType: string
  ): Promise<IRegistration[]> {
    return api.get(`/flagship/paid/${flagshipId}`, { paymentType });
  }

  static async getPendingPaymentVerifications(
    flagshipId: string,
    params?: {
      limit?: number;
      page?: number;
      paymentType?: string;
    }
  ): Promise<IPendingPaymentVerificationResponse> {
    return api.get(`/flagship/pending-payment-verification/${flagshipId}`, params || {});
  }

  static async approveRegistration(registrationId: string, comment: string) {
    return api.patch(`/flagship/approve-registration/${registrationId}`, {
      comment,
    });
  }

  static async rejectRegistration(registrationId: string, comment: string) {
    return api.patch(`/flagship/reject-registration/${registrationId}`, {
      comment,
    });
  }

  static async didntPickRegistration(registrationId: string, comment: string) {
    return api.patch(`/flagship/didnt-pick/${registrationId}`, { comment });
  }

  static async getRegistrationStats(
    flagshipId: string
  ): Promise<IRegistrationStats> {
    return api.get(`/flagship/registeration-stats/${flagshipId}`);
  }

  static async getPaymentStats(flagshipId: string): Promise<IPaymentStats> {
    return api.get(`/flagship/payment-stats/${flagshipId}`);
  }

  static async getRegistrationByID(
    registrationID: string
  ): Promise<IRegistration> {
    return api.get(`/flagship/registration/${registrationID}`);
  }

  static async sendPaymentReminders(
    flagshipId: string,
    registrationIds?: string[],
  ) {
    const payload = Array.isArray(registrationIds) && registrationIds.length > 0
      ? { registrationIds }
      : {};
    return api.post(`/flagship/payment-reminders/${flagshipId}`, payload);
  }

  static async deleteRegistration(
    registrationId: string,
    reason?: string,
  ): Promise<void> {
    return api.delete(`/registration/admin/${registrationId}`, {
      data: reason ? { reason } : undefined,
    });
  }

  static async getPastTrips(): Promise<IFlagship[]> {
    return api.get(`/flagship/past-trips`, { signImages: false });
  }

  static async getLiveTrips(): Promise<IFlagship[]> {
    return api.get(`/flagship/live-trips`, { signImages: false });
  }

  static async getUpcomingTrips(): Promise<IFlagship[]> {
    return api.get(`/flagship/upcoming-trips`, { signImages: false });
  }

  static async getFlagshipByID(flagshipId: string): Promise<IFlagship> {
    return api.get(`/flagship/getByID/${flagshipId}`);
  }

  static async getGoogleSheetStatus(flagshipId: string) {
    return api.get(`/integrations/google-sheets/status`, { flagshipId });
  }

  static async connectGoogleSheet(flagshipId: string, sheetId: string, sheetName?: string) {
    return api.post(`/integrations/google-sheets/connect`, {
      flagshipId,
      sheetId,
      sheetName,
    });
  }

  static async disconnectGoogleSheet(flagshipId: string) {
    return api.delete(`/integrations/google-sheets/disconnect`, {
      params: { flagshipId },
    });
  }

  static async getGroupConflicts(flagshipId: string) {
    return api.get(`/admin/flagship/${flagshipId}/group-conflicts`);
  }

  static async getGroupAnalytics(flagshipId: string) {
    return api.get(`/admin/flagship/${flagshipId}/group-analytics`);
  }

  static async getDiscountAnalytics(flagshipId: string) {
    return api.get(`/admin/flagship/${flagshipId}/discount-analytics`);
  }

  static async reconcileGroupLinks(flagshipId: string) {
    return api.post(`/admin/flagship/${flagshipId}/reconcile-links`);
  }
}
