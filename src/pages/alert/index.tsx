import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Alert from './showAlert'; // Adjust import path

const AlertContainer = () => {
  const [alerts, setAlerts] = useState<{ message: string; type: 'success' | 'error' }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures component is mounted on client

    const handleShowAlert = (event: CustomEvent) => {
      setAlerts((prevAlerts) => [...prevAlerts, event.detail]);

      // Auto-remove the alert after 3 seconds
      setTimeout(() => {
        setAlerts((prevAlerts) => prevAlerts.slice(1));
      }, 5000);
    };

    window.addEventListener('show-alert', handleShowAlert as EventListener);
    return () => window.removeEventListener('show-alert', handleShowAlert as EventListener);
  }, []);

  if (!mounted) return null; // Prevents execution on the server

  return typeof document !== 'undefined'
    ? ReactDOM.createPortal(
        <div className="fixed top-5 right-5 space-y-2 z-50">
          {alerts.map((alert, index) => (
            <Alert key={index} message={alert.message} type={alert.type} />
          ))}
        </div>,
        document.body
      )
    : null;
};

// Function to trigger an alert
export const showAlert = (message: string, type: 'success' | 'error') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-alert', { detail: { message, type } }));
  }
};

export default AlertContainer;
