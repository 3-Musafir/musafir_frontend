import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IFlagship } from "@/services/types/flagship";
import { useRouter } from "next/navigation";
import { resolveImageSrc } from "@/lib/image";

interface TripsContainerProps {
  trips: IFlagship[];
  activeSection: string;
}

export function TripsContainer({ trips, activeSection }: TripsContainerProps) {
  const router = useRouter();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCoverImage = (images?: string[]) => {
    const primary = images?.find((img) => Boolean(img));
    return resolveImageSrc(primary, "/flowerFields.jpg");
  };

  const handleViewTripDetails = (tripId: string) => {
    router.push(`/admin/trip/${tripId}`);
  };

  return (
    <div className="space-y-6">
      {trips?.length > 0 ? trips.map((trip) => (
        <Card
          key={trip._id || trip.id}
          className="overflow-hidden transition-all duration-200 hover:shadow-lg"
          onClick={() => trip?._id && handleViewTripDetails(trip._id)}
        >
          <div className="relative h-48">
            <Image
              src={getCoverImage(trip?.images)}
              alt={trip.tripName || "Trip image"}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">{trip.tripName || "Untitled trip"}</h3>
            <p className="text-sm text-gray-500">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{trip.destination || "Destination TBA"}</span>
              <span className="font-medium">
                {(trip.totalSeats ?? trip.seats ?? 0)} seats
              </span>
            </div>
          </CardContent>
        </Card>
      )) : (
        <div className="text-center text-gray-500 py-8">
          <p className="text-xl font-medium mb-2">No Trips Available Yet</p>
          <p className="text-lg ">Stay tuned! We're working on bringing exciting new trips your way.</p>
        </div>
      )}
    </div>
  );
}
