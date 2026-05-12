import { useRouter } from 'next/navigation';
import { getEditIdFromSearch, withEditId } from '@/lib/flagship-edit';
import { Flagship } from '@/interfaces/flagship';

interface Step {
  label: string;
  route: string;
}

interface ProgressBarProps {
  steps: Step[];
  activeStep: number; // index of the active step
  flagshipData?: Flagship;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, activeStep, flagshipData }) => {
  const router = useRouter();
  const editId =
    typeof window !== 'undefined' ? getEditIdFromSearch(window.location.search) : null;

  const isStepFulfilled = (index: number): boolean => {
    if (!flagshipData) return false;
    
    switch (index) {
      case 0: // Basic Info
        return !!(flagshipData._id && flagshipData.tripName && flagshipData.startDate && flagshipData.endDate);
      case 1: // Content
        return !!(flagshipData.travelPlan && (flagshipData.images?.length || flagshipData.detailedPlan));
      case 2: // Pricing
        return !!(flagshipData.basePrice && flagshipData.locations?.length);
      case 3: // Seats
        return !!(flagshipData.totalSeats !== undefined && flagshipData.totalSeats > 0);
      case 4: // Imp Dates
        return !!(flagshipData.registrationDeadline && flagshipData.advancePaymentDeadline);
      case 5: // Discounts
        return !!(flagshipData.discounts);
      case 6: // Payments
        return !!(flagshipData.selectedBank);
      default:
        return false;
    }
  };

  const isStepAccessible = (index: number): boolean => {
    // Basic Info is always accessible
    if (index === 0) return true;
    
    // Previous steps are always accessible
    if (index <= activeStep) return true;
    
    // To go forward, check if basic info is saved (editId exists)
    if (!editId) return false;

    // Additionally, check if the immediately preceding step is fulfilled
    // This prevents skipping ahead too far
    return isStepFulfilled(index - 1);
  };

  return (
    <div className='w-full px-4 mb-8'>
      <div className='flex items-center'>
        {steps.map((step, index) => {
          const isCompleted = isStepFulfilled(index);
          const isActive = index === activeStep;
          const isAccessible = isStepAccessible(index);

          return (
            <div key={index} className='flex items-center flex-1 last:flex-none'>
              {/* Step circle + label */}
              <div
                className={`flex flex-col items-center ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                onClick={() => isAccessible && router.push(withEditId(step.route, editId))}
                title={step.label}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-white ring-2 ring-offset-2 ring-black'
                      : isCompleted
                        ? 'bg-brand-primary text-black'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 text-center leading-tight w-12 ${
                    isActive ? 'font-bold text-black' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 mt-[-16px] ${
                    isStepFulfilled(index) ? 'bg-brand-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
