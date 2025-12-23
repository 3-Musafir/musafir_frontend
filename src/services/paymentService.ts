import api from "@/pages/api";
import {
  ICreatePayment,
  IPayment,
  IRequestRefund,
  IRefund,
} from "./types/payment";

export class PaymentService {
  static async getBankAccounts() {
    const data = await api.get("/payment/get-bank-accounts");
    return data;
  }

  static async getUserDiscountByRegistration(registrationId: string) {
    try {
      const data = await api.get(
        `/payment/get-user-discount-by-registration/${registrationId}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching user discount:", error);
      return 0;
    }
  }

  static async createBankAccount(bankAccount: any) {
    const data = await api.post(
      "/payment/create-bank-account",
      bankAccount
    );
    return data;
  }

  static async requestRefund(refund: IRequestRefund) {
    const data = await api.post(
      "/payment/refund",
      refund
    );
    return data;
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

      const data = await api.post(
        "/payment/create-payment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error: any) {
      if (error.response) {
        // Server responded with error status
        throw new Error(
          error.response.data?.message || "Failed to create payment"
        );
      } else if (error.request) {
        // Request made but no response received
        throw new Error("No response received from server");
      }
      throw error;
    }
  }

  static async approvePayment(paymentId: string) {
    const data = await api.patch(
      `/payment/approve-payment/${paymentId}`
    );
    return data;
  }

  static async rejectPayment(paymentId: string) {
    const data = await api.patch(
      `/payment/reject-payment/${paymentId}`
    );
    return data;
  }

  static async getPendingPayments(): Promise<IPayment[]> {
    const data = await api.get(
      "/payment/get-pending-payments"
    );
    return data;
  }

  static async getCompletedPayments(): Promise<IPayment[]> {
    const data = await api.get(
      "/payment/get-completed-payments"
    );
    return data;
  }

  static async getPayment(id: string): Promise<IPayment> {
    const data = await api.get(
      `/payment/get-payment/${id}`
    );
    return data;
  }

  static async getRefunds(): Promise<IRefund[]> {
    try {
      const data = await api.get("/payment/get-refunds");
      return data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data?.message || "Failed to fetch refunds"
        );
      } else if (error.request) {
        throw new Error("No response received from server");
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
