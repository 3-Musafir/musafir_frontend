import { IRegistration } from "@/interfaces/trip/trip";
import axios from "axios";
import { IFlagship, IRegistrationStats } from "./types/flagship";

export class FlagshipService {
  static async getRegisteredUsers(
    flagshipId: string,
    search: string = ""
  ): Promise<IRegistration[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/registered/${flagshipId}`,
      {
        params: { search },
      }
    );
    return data;
  }

  static async getPendingVerificationUsers(
    flagshipId: string
  ): Promise<IRegistration[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/pending-verification/${flagshipId}`
    );
    return data;
  }

  static async getPaidUsers(
    flagshipId: string,
    paymentType: string
  ): Promise<IRegistration[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/paid/${flagshipId}`,
      {
        params: { paymentType },
      }
    );
    return data;
  }

  static async approveRegistration(registrationId: string, comment: string) {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/approve-registration/${registrationId}`,
      { comment }
    );
    return data;
  }

  static async rejectRegistration(registrationId: string, comment: string) {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/reject-registration/${registrationId}`,
      { comment }
    );
    return data;
  }

  static async didntPickRegistration(registrationId: string, comment: string) {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/didnt-pick/${registrationId}`,
      { comment }
    );
    return data;
  }

  static async getRegistrationStats(
    flagshipId: string
  ): Promise<IRegistrationStats> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/registeration-stats/${flagshipId}`
    );
    return data;
  }

  static async getPaymentStats(flagshipId: string) {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/payment-stats/${flagshipId}`
    );
    return data;
  }

  static async getRegistrationByID(
    registrationID: string
  ): Promise<IRegistration> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/registration/${registrationID}`
    );
    return data;
  }

  static async getPastTrips(): Promise<IFlagship[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/past-trips`
    );
    return data;
  }

  static async getLiveTrips(): Promise<IFlagship[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/live-trips`
    );
    return data;
  }

  static async getUpcomingTrips(): Promise<IFlagship[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/upcoming-trips`
    );
    return data;
  }

  static async getFlagshipByID(flagshipId: string): Promise<IFlagship> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/flagship/${flagshipId}`
    );
    return data;
  }
}
