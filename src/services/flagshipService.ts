import { IRegistration } from "@/interfaces/trip/trip";
import api from "@/pages/api";
import { IFlagship, IRegistrationStats } from "./types/flagship";

export class FlagshipService {
  static async getRegisteredUsers(
    flagshipId: string,
    search: string = ""
  ): Promise<IRegistration[]> {
    const data = await api.get(
      `/flagship/registered/${flagshipId}`,
      { search }
    );
    return data;
  }

  static async getPendingVerificationUsers(
    flagshipId: string
  ): Promise<IRegistration[]> {
    const data = await api.get(
      `/flagship/pending-verification/${flagshipId}`
    );
    return data;
  }

  static async getPaidUsers(
    flagshipId: string,
    paymentType: string
  ): Promise<IRegistration[]> {
    const data = await api.get(
      `/flagship/paid/${flagshipId}`,
      { paymentType }
    );
    return data;
  }

  static async approveRegistration(registrationId: string, comment: string) {
    const data = await api.patch(
      `/flagship/approve-registration/${registrationId}`,
      { comment }
    );
    return data;
  }

  static async rejectRegistration(registrationId: string, comment: string) {
    const data = await api.patch(
      `/flagship/reject-registration/${registrationId}`,
      { comment }
    );
    return data;
  }

  static async didntPickRegistration(registrationId: string, comment: string) {
    const data = await api.patch(
      `/flagship/didnt-pick/${registrationId}`,
      { comment }
    );
    return data;
  }

  static async getRegistrationStats(
    flagshipId: string
  ): Promise<IRegistrationStats> {
    const data = await api.get(
      `/flagship/registeration-stats/${flagshipId}`
    );
    return data;
  }

  static async getPaymentStats(flagshipId: string) {
    const data = await api.get(
      `/payment-stats/${flagshipId}`
    );
    return data;
  }

  static async getRegistrationByID(
    registrationID: string
  ): Promise<IRegistration> {
    const data = await api.get(
      `/flagship/registration/${registrationID}`
    );
    return data;
  }

  static async getPastTrips(): Promise<IFlagship[]> {
    const data = await api.get(
      "/flagship/past-trips"
    );
    return data;
  }

  static async getLiveTrips(): Promise<IFlagship[]> {
    const data = await api.get(
      "/flagship/live-trips"
    );
    return data;
  }

  static async getUpcomingTrips(): Promise<IFlagship[]> {
    const data = await api.get(
      "/flagship/upcoming-trips"
    );
    return data;
  }

  static async getFlagshipByID(flagshipId: string): Promise<IFlagship> {
    const data = await api.get(
      `/flagship/${flagshipId}`
    );
    return data;
  }
}
