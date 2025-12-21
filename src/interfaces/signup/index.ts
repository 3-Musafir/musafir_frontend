export interface BaseUser {
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  cnic: string;
  city: string;
  socialLink: string;
  university?: string;
  employmentStatus?: 'student' | 'employed' | 'selfEmployed' | 'unemployed';
  dateOfBirth?: string;
  referralCode?: string;
}

// Signup with Email & Password
export interface SignupUser extends BaseUser {
  password?: string;
}

// Signup with Google
export interface SignupGoogleUser extends BaseUser {
  googleId: string;
}