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
}

const PassportPastCard: React.FC<PassportPastCardProps> = ({ registrationId, title, date, location, rating, price, status }) => {
  const router = useRouter();

  return (
    <div className="w-full rounded-xl bg-green-800 px-4 py-5 text-white">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-sm opacity-80">
        {date} @ {location}
      </p>
      {rating ? (
        <p className="mt-2 text-sm">
          You Rated {rating} out of 10
        </p>
      ) : (
        status === "refunded" ? (
          <p className="mt-2 text-sm">
            Refunded
          </p>
        ) : (
          <button
            className="mt-2 text-sm bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded-[20px]"
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