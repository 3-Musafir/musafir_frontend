import api from "@/pages/api";
import { IRegistration } from "@/interfaces/trip/trip";
import { IFlagship, IRegistrationStats } from "./types/flagship";

export class FlagshipService {
  static async getRegisteredUsers(
    flagshipId: string,
    search: string = ""
  ): Promise<IRegistration[]> {
    return api.get(`/flagship/registered/${flagshipId}`, { search });
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

  static async getPaymentStats(flagshipId: string) {
    return api.get(`/payment-stats/${flagshipId}`);
  }

  static async getRegistrationByID(
    registrationID: string
  ): Promise<IRegistration> {
    return api.get(`/flagship/registration/${registrationID}`);
  }

  static async getPastTrips(): Promise<IFlagship[]> {
    return api.get(`/flagship/past-trips`);
  }

  static async getLiveTrips(): Promise<IFlagship[]> {
    return api.get(`/flagship/live-trips`);
  }

  static async getUpcomingTrips(): Promise<IFlagship[]> {
    return api.get(`/flagship/upcoming-trips`);
  }

  static async getFlagshipByID(flagshipId: string): Promise<IFlagship> {
    return api.get(`/flagship/${flagshipId}`);
  }
}
