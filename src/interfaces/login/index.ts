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

interface ReviewPreferences {
  preferredReviewIds: string[];
  questionTags: string[];
  personaTags: string[];
  updatedAt?: string;
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
  employmentStatus?: 'student' | 'employed' | 'selfEmployed' | 'unemployed';
    socialLink?: string;
    dateOfBirth?: string;
    working?: boolean;
    city?: string;
    heardFrom?: string;
    roles?: [string];
  profileImg?: string;
    emailVerified?: boolean;
    verification?: VerificationSubSchema;
    verificationStats?: { verifiedByMe: number };
    reviewPreferences?: ReviewPreferences;
  }
  
