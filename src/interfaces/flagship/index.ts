export interface Flagship {
  _id?: string;
  tripName: string;
  destination: string;
  startDate: Date | string;
  endDate: Date | string;
  category: string;
  visibility: string;
  updatedAt?: string;
  contentVersion?: string;
  days?: number;
  status?: string;

  // Pricing
  basePrice?: string;
  locations?: {
    name: string;
    price: string;
    enabled: boolean;
  }[];
  tiers?: {
    name: string;
    price: string;
  }[];
  mattressTiers?: {
    name: string;
    price: string;
  }[];
  earlyBirdPrice?: number;
  images?: string[];
  travelPlan?: string;
  tocs?: string;
  detailedPlan?: string;

  // Seats Allocation
  totalSeats?: number;
  femaleSeats?: number;
  maleSeats?: number;
  citySeats?: object;
  bedSeats?: number;
  mattressSeats?: number;
  genderSplitEnabled?: boolean;
  citySplitEnabled?: boolean;
  mattressSplitEnabled?: boolean;
  mattressPriceDelta?: number;

  // Important Dates
  tripDates?: string;
  registrationDeadline?: Date | string;
  advancePaymentDeadline?: Date | string;
  earlyBirdDeadline?: Date | string;

  // Discounts
  discounts?: {
    totalDiscountsValue: string;
    soloFemale: {
      amount: string;
      count: string;
      enabled: boolean;
      usedValue?: number;
      usedCount?: number;
    };
    group: {
      amount: string;
      count: string;
      enabled: boolean;
      usedValue?: number;
      usedCount?: number;
    };
    musafir: {
      amount?: string;
      count: string;
      enabled: boolean;
      usedValue?: number;
      usedCount?: number;
    };
  };

  selectedBank?: string;
}

export interface BaseFlagShip {
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  category: string;
  visibility: string;
}

export interface FlagshipContent {
  travelPlanContent: string;
  tocsContent: string;
  files: {
    name: string;
    size: string;
  }[];
}

export interface FlagshipPricing {
  basePrice: string;
  locations: {
    name: string;
    price: string;
    enabled: boolean;
  }[];
  tiers: {
    name: string;
    price: string;
  }[];
  mattressTiers: {
    name: string;
    price: string;
  }[];
}

export interface FlagshipDiscounts {
  totalDiscountsValue?: string;
  soloFemale?: {
    amount: string;
    count: string;
    enabled: boolean;
    usedValue?: number;
    usedCount?: number;
  };
  group?: {
    amount: string;
    count: string;
    enabled: boolean;
    usedValue?: number;
    usedCount?: number;
  };
  musafir?: {
    amount?: string;
    count: string;
    enabled: boolean;
    usedValue?: number;
    usedCount?: number;
  };
}

export interface IUpdateFlagship {
  contentVersion?: string;
  // Pricing fields
  basePrice?: string;
  locations?: {
    name?: string;
    price?: string;
    enabled?: boolean;
  }[];
  tiers?: {
    name?: string;
    price?: string;
  }[];
  mattressTiers?: {
    name?: string;
    price?: string;
  }[];
  earlyBirdPrice?: number;

  // Content fields
  travelPlan?: string;
  tocs?: string;
  files?: File[] | any[];

  // Seats Allocation fields
  totalSeats?: number;
  femaleSeats?: number;
  maleSeats?: number;
  citySeats?: object;
  bedSeats?: number;
  mattressSeats?: number;
  genderSplitEnabled?: boolean;
  citySplitEnabled?: boolean;
  mattressSplitEnabled?: boolean;
  mattressPriceDelta?: number;

  // Important Dates
  tripDates?: string;
  registrationDeadline?: Date;
  advancePaymentDeadline?: Date;
  earlyBirdDeadline?: Date;

  // Discounts fields
  discounts?: {
    totalDiscountsValue?: string;
    soloFemale?: {
      amount: string;
      count: string;
      enabled: boolean;
      usedValue?: number;
      usedCount?: number;
    };
    group?: {
      amount: string;
      count: string;
      enabled: boolean;
      usedValue?: number;
      usedCount?: number;
    };
    musafir?: {
      amount?: string;
      count: string;
      enabled: boolean;
      usedValue?: number;
      usedCount?: number;
    };
  };

  // payment
  selectedBank?: string;

  // flagship status
  publish?: boolean;
}

export interface IFlagshipFilter {
  tripName?: string;
  startDate?: Date;
  endDate?: Date;
  category?: 'detox' | 'flagship' | 'adventure' | 'student';
  visibility?: 'public' | 'private';
  createdBy?: string;
  destination?: string;
  days?: number;
  seats?: number;
  status?: string;
  totalSeats?: number;
  femaleSeats?: number;
  maleSeats?: number;
  bedSeats?: number;
  registrationDeadline?: Date;
  advancePaymentDeadline?: Date;
  earlyBirdDeadline?: Date;
  publish?: boolean;
}
