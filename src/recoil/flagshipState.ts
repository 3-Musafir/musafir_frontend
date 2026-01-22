import { atom } from 'recoil';

export interface Flagship {
  id: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  price: number;
  availableSeats: number;
  registrationDeadline: string;
  description: string;
  imageUrl: string;
}

export const flagshipState = atom<Flagship | null>({
  key: 'flagshipState',
  default: null,
}); 
