import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

export default function Alert({
  message,
  type,
  autoDismiss = false,
  duration = 3000,
}: {
  message: string;
  type: 'success' | 'error';
  autoDismiss?: boolean;
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration]);

  if (!visible) return null;

  const bgColor =
    type === 'success'
      ? 'bg-brand-primary/10 border-green-400 text-brand-primary'
      : 'bg-brand-error-light border-red-400 text-brand-error';

  return (
    <div
      className={`${bgColor} border px-4 py-3 rounded flex items-center justify-between space-x-2`}
      role="alert"
      aria-live="polite"
    >
      <span className="whitespace-pre-line">{message}</span>
      <button onClick={() => setVisible(false)} className="shrink-0 self-start mt-0.5">
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
