export interface BaseRegistration {
    flagshipId: string;
    paymentId?: string;
    isPaid?: boolean;
    joiningFromCity: string;
    tier: string;
    bedPreference: string;
    roomSharing: string;
    groupMembers?: string[];
    expectations: string;
    tripType: string;
    price: number;
}
