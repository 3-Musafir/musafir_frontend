export default function PastTripCard({ trip }) {
  return (
    <div className='bg-white rounded-lg overflow-hidden shadow'>
      <div className='p-4'>
        <h3 className='font-bold'>{trip.tripName}</h3>
        <p className='text-xs mt-1 text-gray-600'>{trip.description}</p>
      </div>
      <div className='relative h-24 bg-pink-50'>
        <div className='absolute right-0 bottom-0'>
          <div className='w-20 h-20 relative'>
            {/* <svg viewBox='0 0 100 100' className='w-full h-full'>
              <circle cx='50' cy='50' r='40' fill='#FF5733' />
              <path d='M50,20 C60,40 80,50 50,80 C20,50 40,40 50,20 Z' fill='#4CAF50' />
            </svg> */}
          </div>
        </div>
      </div>
    </div>
  );
}
