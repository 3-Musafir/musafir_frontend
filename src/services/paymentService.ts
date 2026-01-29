import api from "@/lib/api";
import { mapErrorToUserMessage } from "@/utils/errorMessages";
import {
  ICreatePayment,
  IPayment,
  IRefund,
  IRequestRefund,
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

  static async getRefundQuote(registrationId: string) {
    return api.get(`/payment/refund-quote/${registrationId}`);
  }

  static async getRefundStatus(registrationId: string) {
    return api.get(`/payment/refund-status/${registrationId}`);
  }

  static async createPayment(payment: ICreatePayment) {
    const formData = new FormData();
    formData.append("registration", payment.registration);
    if (payment.bankAccount) {
      formData.append("bankAccount", payment.bankAccount);
    }
    if (payment.bankAccountLabel) {
      formData.append("bankAccountLabel", payment.bankAccountLabel);
    }
    formData.append("paymentType", payment.paymentType);
    formData.append("amount", payment.amount.toString());
    formData.append("discount", payment.discount?.toString() || "0");
    if (typeof payment.walletAmount === "number") {
      formData.append("walletAmount", payment.walletAmount.toString());
    }
    if (payment.walletUseId) {
      formData.append("walletUseId", payment.walletUseId);
    }
    if (payment.screenshot) {
      formData.append("screenshot", payment.screenshot);
    }

    // Let the shared API layer surface structured errors (including verification codes)
    return api.post(`/payment/create-payment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

  static async getRefunds(params?: {
    group?: "all" | "pending" | "approved_not_credited" | "credited" | "rejected";
    page?: number;
    limit?: number;
    flagshipId?: string;
  }): Promise<IRefund[] | { refunds: IRefund[]; page: number; limit: number; total: number; totalPages: number }> {
    try {
      return api.get(`/payment/get-refunds`, params || {});
    } catch (error) {
      throw new Error(mapErrorToUserMessage(error));
    }
  }

  static async approveRefund(id: string): Promise<void> {
    try {
      await api.patch(`/payment/approve-refund/${id}`);
    } catch (error) {
      throw new Error(mapErrorToUserMessage(error));
    }
  }

  static async approveRefundNoCredit(id: string): Promise<void> {
    try {
      await api.patch(`/payment/approve-refund-no-credit/${id}`);
    } catch (error) {
      throw new Error(mapErrorToUserMessage(error));
    }
  }

  static async postRefundCredit(id: string): Promise<void> {
    try {
      await api.patch(`/payment/post-refund-credit/${id}`);
    } catch (error) {
      throw new Error(mapErrorToUserMessage(error));
    }
  }

  static async postRefundBank(id: string): Promise<void> {
    try {
      await api.patch(`/payment/post-refund-bank/${id}`);
    } catch (error) {
      throw new Error(mapErrorToUserMessage(error));
    }
  }

  static async rejectRefund(id: string): Promise<void> {
    try {
      await api.patch(`/payment/reject-refund/${id}`);
    } catch (error) {
      throw new Error(mapErrorToUserMessage(error));
    }
  }

  // Wallet (user)
  static async getWalletSummary() {
    return api.get(`/wallet/summary`);
  }

  static async getWalletTransactions(params?: { page?: number; limit?: number; cursor?: string }) {
    return api.get(`/wallet/transactions`, params || {});
  }

  static async createWalletTopupRequest(packageAmount: number) {
    return api.post(`/wallet/topup-request`, { packageAmount });
  }

  static async getUserPayments(params?: { limit?: number; cursor?: string }) {
    return api.get(`/payment/user-payments`, params || {});
  }

  // Wallet (admin)
  static async adminListWallets(params?: {
    page?: number;
    limit?: number;
    search?: string;
    includeEmpty?: boolean;
  }) {
    return api.get(`/admin/wallets`, params || {});
  }

  static async adminListWalletTransactions(userId: string, params?: { page?: number; limit?: number; cursor?: string; type?: string }) {
    return api.get(`/admin/wallets/${userId}/transactions`, params || {});
  }

  static async adminGetWalletSummary(userId: string) {
    return api.get(`/admin/wallets/${userId}/summary`);
  }

  // Top-ups (admin)
  static async adminListTopups(params?: {
    status?: "pending" | "processed" | "rejected";
    page?: number;
    limit?: number;
  }) {
    return api.get(`/admin/topups`, params || {});
  }

  static async adminMarkTopupCredited(id: string) {
    return api.patch(`/admin/topups/${id}/mark-credited`);
  }

  static async adminRejectTopup(id: string, reason?: string) {
    return api.patch(`/admin/topups/${id}/reject`, { reason });
  }
}
