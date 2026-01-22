import api from '../pages/api';
import apiEndpoints from '../config/apiEndpoints';

const useFeedbackHook = () => {
  const { FEEDBACK } = apiEndpoints;

  const createFeedback = async (feedback: any, registrationId: string): Promise<any> => {
    return await api.post(FEEDBACK.CREATE.replace(':registrationId', registrationId), feedback);
  };

  return {
    createFeedback,
  };
};

export default useFeedbackHook;
