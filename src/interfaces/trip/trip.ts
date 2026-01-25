import { IFlagship } from "@/services/types/flagship";

export interface IRegistration {
  _id: string;
  flagship: IFlagship | string;
  user: IUser | string;
  payment?: IPayment | string;
  paymentId?: IPayment | string;
  amountDue?: number;
  discountApplied?: number;
  cancelledAt?: string;
  refundStatus?: string;
  waitlistOfferStatus?: string;
  waitlistOfferExpiresAt?: string;
  status: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  id: string;
  latestPaymentId?: string;
  latestPaymentStatus?: 'pendingApproval' | 'approved' | 'rejected' | 'none';
  latestPaymentCreatedAt?: string;
  latestPaymentType?: string;
  latestPaymentAmount?: number;
}

export interface IUser {
  _id: string;
  fullName: string;
  profileImg: string;
  email: string;
  phone: string;
  referralID: string;
  gender: string;
  cnic: string;
  dateOfBirth: string;
  university: string;
  socialLink: string;
  city: string;
  roles: string[];
  emailVerified: boolean;
  verification: IVerification;
  createdAt: string;
  updatedAt: string;
}

export interface IVerification {
  status: string;
  RequestCall: boolean;
  videoLink?: string;
  referralIDs?: string[];
  verificationDate?: string;
  verificationRequestDate?: string;
  method?: string;
}

export interface IPayment {
  _id: string;
  user: string;
  amount: number;
  discount?: number;
  bankName: string;
  status: string;
  paymentType: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  paymentMethod?: string;
  screenshot?: string;
  rejectionReason?: string;
}

export interface IPendingPaymentVerificationItem {
  _id: string;
  paymentType: string;
  paymentMethod?: string;
  amount: number;
  screenshot?: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  registration: {
    _id: string;
    status?: string;
    joiningFromCity?: string;
    tier?: string;
    bedPreference?: string;
    price?: number;
    type?: string;
    createdAt?: string;
    user?: IUser;
  };
}

export interface IPendingPaymentVerificationResponse {
  payments: IPendingPaymentVerificationItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
