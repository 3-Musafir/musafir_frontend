interface VerificationSubSchema {
    verificationID?: string;
    encodedVideo?: string;
    referralIDs?: [string];
    status?: boolean;
    videoLink?: string;
    verificationDate?: Date;
    VerificationRequestDate?: Date;
    RequestCall: boolean;
  }
  
  export interface User {
    fullName: string;
    email?: string;
    password?: string;
    googleId?: string;
    phone?: string;
    referralID?: string;
    gender?: 'male' | 'female' | 'other';
    cnic?: string;
    university?: string;
    socialLink?: string;
    dateOfBirth?: string;
    working?: boolean;
    city?: string;
    heardFrom?: string;
    roles?: [string];
    emailVerified?: boolean;
    verification?: VerificationSubSchema;
    verificationStats?: { verifiedByMe: number };
  }
  