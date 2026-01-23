export interface IFlagship {
  _id: string;
  tripName: string;
  startDate: string;
  endDate: string;
  category: string;
  visibility: string;
  images: string[];
  created_By: string;
  destination: string;
  days: number;
  seats: number;
  status: string;
  packages: Package[];
  basePrice: string;
  earlyBirdPrice?: number;
  locations: Location[];
  tiers: Tier[];
  mattressTiers: MattressTier[];
  files: File[];
  detailedPlan?: string;
  totalSeats: number;
  femaleSeats: number;
  maleSeats: number;
  citySeats: CitySeat[];
  bedSeats: number;
  mattressSeats: number;
  publish: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface Package {
  name: string;
  features: string[];
  price: string;
}

export interface Location {
  name: string;
  price: string;
  enabled: boolean;
}

export interface Tier {
  name: string;
  price: string;
}

export interface MattressTier {
  name: string;
  price: string;
}

export interface File {
  name: string;
  size: string;
  _id: string;
  id: string;
}

export interface CitySeat {
  city: string;
  seats: number;
}

export interface IRegistrationStats {
  flagshipName: string;
  daysUntilStart: number;
  totalRegistrations: number;
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
  paidCount: number;
  newCount: number;
  onboardingCount: number;
  paymentCount: number;
  waitlistedCount: number;
  confirmedCount: number;
  cancelledCount: number;
  teamSeats: number;
  lahoreSeats: number;
  islamabadSeats: number;
  karachiSeats: number;
  maleCount: number;
  femaleCount: number;
  maleSeats: number;
  femaleSeats: number;
  ageDistribution: {
    "0-9": number;
    "10-19": number;
    "20-29": number;
    "30-39": number;
    "40-49": number;
    "50+": number;
  };
  topUniversities: Array<{
    university: string;
    count: number;
  }>;
  newUsersCount: number;
  returningUsersCount: number;
}
