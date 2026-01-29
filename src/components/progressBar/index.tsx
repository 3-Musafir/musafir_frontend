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
    <div className='w-full flex px-4 space-x-1 mb-8'>
      {steps.map((step, index) => {
        let bgClass = 'bg-gray-200';
        if (index === activeStep) {
          bgClass = 'bg-brand-primary';
        } else if (index < activeStep) {
          bgClass = 'bg-orange-200';
        }
        return (
          //   <Link key={index} href={step.route}>
          <div
            key={index}
            onClick={() => router.push(withEditId(step.route, editId))}
            className={`h-2 flex-1 rounded-sm cursor-pointer ${bgClass}`}
            title={step.label}
          ></div>
          //   </Link>
        );
      })}
    </div>
  );
};

export default ProgressBar;
