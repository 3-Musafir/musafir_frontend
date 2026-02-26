import { IRegistration } from "@/interfaces/trip/trip";
import { IFlagship } from "./flagship";
import { IUser } from "./user";

export type PaymentMethod =
  | "bank_transfer"
  | "wallet_only"
  | "wallet_plus_bank"
  | "cash"
  | "split_cash_bank"
  | "partial_cash";

export type PaymentMode = "wallet_only" | "bank_transfer" | "wallet_plus_bank";

export interface ICreatePayment {
  bankAccount?: string;
  bankAccountLabel?: string;
  paymentType: string;
  registration: string;
  amount: number;
  discount?: number;
  discountType?: "soloFemale" | "group" | "musafir";
  walletAmount?: number;
  walletUseId?: string;
  screenshot?: File;
}

export interface IPaymentQuoteRequest {
  registration: string;
  walletAmount?: number;
  discountType?: "soloFemale" | "group" | "musafir";
  paymentMode?: PaymentMode;
}

export interface IPaymentQuoteResponse {
  amountDue: number;
  discountApplied: number;
  maxWalletUsable: number;
  walletApplied: number;
  cashDue: number;
  payableNow: number;
  requiresScreenshot: boolean;
  paymentMode: PaymentMode;
  pendingApproval?: boolean;
  errors?: Array<{ code: string; message: string }>;
}

export interface IAdminManualPayment {
  registration: string;
  paymentMethod: "cash" | "bank_transfer" | "split_cash_bank" | "partial_cash";
  cashAmount?: number;
  bankAmount?: number;
  bankAccount?: string;
  bankAccountLabel?: string;
  cashProof?: File;
  bankProof?: File;
  idempotencyKey?: string;
  adminNote?: string;
}

export interface IBankAccount {
  _id: string;
  bankName: string;
  accountNumber: string;
  IBAN: string;
  __v: number;
}

export interface IPayment {
  _id: string;
  registration: IRegistration | string;
  bankAccount: IBankAccount | string | null;
  bankAccountLabel?: string;
  paymentType: string;
  paymentMethod?: PaymentMethod;
  amount: number;
  discount?: number;
  walletApplied?: number;
  walletRequested?: number;
  screenshot?: string;
  cashAmount?: number;
  bankAmount?: number;
  cashProofKey?: string;
  bankProofKey?: string;
  createdByAdmin?: boolean;
  recordedBy?: string;
  recordedAt?: string;
  adminNote?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRequestRefund {
  registration: string;
  bankDetails: string;
  reason: string;
  feedback: string;
  rating: number;
}

export interface IRefund {
  _id: string;
  registration: IRegistration | string;
  bankDetails: string;
  reason: string;
  feedback: string;
  rating: number;
  status: "pending" | "cleared" | "rejected";
  amountPaid?: number;
  refundPercent?: number;
  processingFee?: number;
  refundAmount?: number;
  tierLabel?: string;
  policyLink?: string;
  policyAppliedAt?: string;
  settlement?: {
    _id: string;
    status: "pending" | "posted" | "void";
    amount: number;
    method: "wallet_credit" | "bank_refund";
    postedAt?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
