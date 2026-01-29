import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveImageSrc } from '@/lib/image';

interface HomeEventCardProps {
  _id: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  images?: string[] | null;
}

export default function HomeEventCard({
  _id,
  tripName,
  destination,
  startDate,
  endDate,
  images,
}: HomeEventCardProps) {
  const router = useRouter();
  const defaultImage = '/flowerFields.jpg';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleClick = () => {
    router.push(`/flagship/details?id=${_id}`);
  };

  const imageUrls = (images && images.length > 0 ? images : [defaultImage]).map(
    (image) => resolveImageSrc(image, defaultImage),
  );

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-300 h-full flex flex-col"
    >
      <div className="relative h-48 sm:h-52 lg:h-56">
        <Image
          src={imageUrls[currentImageIndex]}
          alt={tripName || 'Event image'}
          fill
          className="object-cover"
        />

        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {imageUrls.map((_: string, index: number) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${currentImageIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="space-y-2 lg:space-y-3 p-4 lg:p-5 flex-1">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">{tripName}</h3>
        <p className="text-sm lg:text-base text-gray-600">
          {new Date(startDate).getDate()} - {new Date(endDate).getDate()}th {new Date(endDate).toLocaleString('default', { month: 'short' })} @ {destination}
        </p>
      </div>
    </div>
  );
} 
