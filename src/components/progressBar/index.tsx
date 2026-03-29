import { useRouter } from 'next/navigation';
import { getEditIdFromSearch, withEditId } from '@/lib/flagship-edit';

interface Step {
  label: string;
  route: string;
}

interface ProgressBarProps {
  steps: Step[];
  activeStep: number; // index of the active step
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, activeStep }) => {
  const router = useRouter();
  const editId =
    typeof window !== 'undefined' ? getEditIdFromSearch(window.location.search) : null;

  return (
    <div className='w-full px-4 mb-8'>
      <div className='flex items-center'>
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;

          return (
            <div key={index} className='flex items-center flex-1 last:flex-none'>
              {/* Step circle + label */}
              <div
                className='flex flex-col items-center cursor-pointer'
                onClick={() => router.push(withEditId(step.route, editId))}
                title={step.label}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isCompleted
                      ? 'bg-brand-primary text-black'
                      : isActive
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
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
                    index < activeStep ? 'bg-brand-primary' : 'bg-gray-200'
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
