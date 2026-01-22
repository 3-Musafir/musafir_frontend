export interface IUser {
  _id: string;
  fullName: string;
  profileImg: string;
  email: string;
  phone: string;
  referralID: string;
  gender: string;
  cnic: string;
  university: string;
  socialLink: string;
  dateOfBirth: string;
  city: string;
  roles: string[];
  emailVerified: boolean;
  verification: Verification;
  createdAt: string;
  updatedAt: string;
}

export interface Verification {
  status: string;
  RequestCall: boolean;
  videoLink?: string;
}
