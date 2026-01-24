import React from 'react';
import { useRouter } from 'next/router';

interface PassportPastCardProps {
  registrationId: string;
  title: string;
  date: string;
  location: string;
  rating?: number;
  price: number;
  status: string;
  refundStatus?: string;
}

const PassportPastCard: React.FC<PassportPastCardProps> = ({
  registrationId,
  title,
  date,
  location,
  rating,
  price,
  status,
  refundStatus,
}) => {
  const router = useRouter();
  const isRefunded = refundStatus === "refunded" || status === "refunded";

  return (
    <div className="w-full rounded-xl bg-green-800 px-4 py-5 lg:px-6 lg:py-6 text-white">
      <h3 className="text-xl lg:text-2xl font-semibold">{title}</h3>
      <p className="mt-1 lg:mt-2 text-sm lg:text-base opacity-80">
        {date} @ {location}
      </p>
      {rating ? (
        <p className="mt-2 lg:mt-3 text-sm lg:text-base">
          You Rated {rating} out of 10
        </p>
      ) : (
        isRefunded ? (
          <p className="mt-2 lg:mt-3 text-sm lg:text-base">
            Refunded
          </p>
        ) : (
          <button
            className="mt-2 lg:mt-3 text-sm lg:text-base bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 lg:py-2.5 lg:px-5 rounded-[20px]"
            onClick={() => router.push({
            pathname: '/feedback',
            query: {
              registrationId: registrationId,
              title: title,
              price: price
            }
          })}
        >
          Give Feedback
        </button>
      ))}
    </div>
  );
};

export default PassportPastCard; 
