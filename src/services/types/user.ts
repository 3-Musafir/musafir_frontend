export interface IFlagshipAttended {
  _id: string;
  tripName: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  destination?: string;
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
  university: string;
  socialLink: string;
  dateOfBirth: string;
  city: string;
  roles: string[];
  emailVerified: boolean;
  verification: Verification;
  createdAt: string;
  updatedAt: string;
  numberOfFlagshipsAttended?: number;
  flagshipsAttended?: IFlagshipAttended[];
}

export interface Verification {
  status: string;
  RequestCall: boolean;
  videoLink?: string;
}
