import axios from "axios";
import api from "@/pages/api";
import {
  ICreatePayment,
  IPayment,
  IRequestRefund,
  IRefund,
} from "./types/payment";

export class PaymentService {
  static async getBankAccounts() {
    return api.get(`/payment/get-bank-accounts`);
  }

  static async getUserDiscountByRegistration(registrationId: string) {
    try {
      return api.get(
        `/payment/get-user-discount-by-registration/${registrationId}`
      );
    } catch (error) {
      console.error("Error fetching user discount:", error);
      return 0;
    }
  }

  static async createBankAccount(bankAccount: any) {
    return api.post(`/payment/create-bank-account`, bankAccount);
  }

  static async requestRefund(refund: IRequestRefund) {
    return api.post(`/payment/refund`, refund);
  }

  static async createPayment(payment: ICreatePayment) {
    try {
      const formData = new FormData();
      formData.append("registration", payment.registration);
      formData.append("bankAccount", payment.bankAccount);
      formData.append("paymentType", payment.paymentType);
      formData.append("amount", payment.amount.toString());
      formData.append("discount", payment.discount?.toString() || "0");
      formData.append("screenshot", payment.screenshot);

      return api.post(`/payment/create-payment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          throw new Error(
            error.response.data.message || "Failed to create payment"
          );
        } else if (error.request) {
          // Request made but no response received
          throw new Error("No response received from server");
        }
      }
      // Generic error handling
      // throw new Error('Failed to create payment: ' + error.message);
    }
  }

  static async approvePayment(paymentId: string) {
    return api.patch(`/payment/approve-payment/${paymentId}`);
  }

  static async rejectPayment(paymentId: string) {
    return api.patch(`/payment/reject-payment/${paymentId}`);
  }

  static async getPendingPayments(): Promise<IPayment[]> {
    return api.get(`/payment/get-pending-payments`);
  }

  static async getCompletedPayments(): Promise<IPayment[]> {
    return api.get(`/payment/get-completed-payments`);
  }

  static async getPayment(id: string): Promise<IPayment> {
    return api.get(`/payment/get-payment/${id}`);
  }

  static async getRefunds(): Promise<IRefund[]> {
    try {
      return api.get(`/payment/get-refunds`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Failed to fetch refunds"
          );
        } else if (error.request) {
          throw new Error("No response received from server");
        }
      }
      throw new Error("Failed to fetch refunds");
    }
  }

  static async approveRefund(id: string): Promise<void> {
    try {
      await api.patch(`/payment/approve-refund/${id}`);
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to approve refund"
        );
      } else if (error.request) {
        throw new Error("No response received from server");
      }
      throw new Error("Failed to approve refund");
    }
  }

  static async rejectRefund(id: string): Promise<void> {
    try {
      await api.patch(`/payment/reject-refund/${id}`);
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to reject refund"
        );
      } else if (error.request) {
        throw new Error("No response received from server");
      }
      throw new Error("Failed to reject refund");
    }
  }
}
