import React from 'react';

interface ReviewCardProps {
  name: string;
  location: string;
  rating: number;
  eventName: string;
  comment: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  location,
  rating,
  eventName,
  comment
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 bg-white">
      <div className="flex justify-between items-start mb-1">
        <div className="space-y-0.5">
          <h4 className="text-base font-semibold text-gray-900">{name}</h4>
        </div>
        <div className="text-sm font-bold">{rating}/10</div>
      </div>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-gray-600">{location}</p>
        <p className="text-sm text-gray-600 mb-1">{eventName}</p>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{comment}</p>
    </div>
  );
};

export default ReviewCard; 