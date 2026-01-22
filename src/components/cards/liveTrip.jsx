export default function LiveTripCard({ trip }) {
  return (
    <div className='bg-white rounded-lg overflow-hidden shadow'>
      <div className='relative h-32 bg-blue-900'>
        <div className='absolute inset-0 flex items-center justify-end pr-4'>
          <div className='w-24 h-24 relative'>
            <svg viewBox='0 0 24 24' className='w-full h-full text-white'>
              <path
                fill='currentColor'
                d='M22,16V4c0-1.1-0.9-2-2-2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12C21.1,18,22,17.1,22,16z M11,12l2.03,2.71L16,11l4,5H8L11,12z M2,6v14c0,1.1,0.9,2,2,2h14v-2H4V6H2z'
              />
            </svg>
          </div>
        </div>
        <div className='absolute inset-0 p-4 text-white'>
          <h3 className='font-bold'>{trip.tripName}</h3>
          <p className='text-xs mt-1 opacity-80'>{trip.description}</p>
        </div>
      </div>
    </div>
  );
}
