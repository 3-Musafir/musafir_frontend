import api from '../pages/api';
import apiEndpoints from '../config/apiEndpoints';
import { BaseRegistration } from '@/interfaces/registration';
import { showAlert } from '@/pages/alert';
import { mapErrorToUserMessage } from '@/utils/errorMessages';

const useRegistrationHook = () => {
  const { REGISTRATION } = apiEndpoints;

  const create = async (data: BaseRegistration): Promise<unknown> => {
    const res = await api.post(`${REGISTRATION.CREATE}`, data);
    if (res) {
      return res;
    }
    return false;
  };

  const getPastPassport = async (): Promise<any> => {
    const res = await api.get(`${REGISTRATION.GET_PAST_PASSPORT}`);
    if (res.statusCode === 200) {
      return res.data;
    }
    return false;
  };

  const getUpcomingPassport = async (): Promise<any> => {
    const res = await api.get(`${REGISTRATION.GET_UPCOMING_PASSPORT}`);
    if (res.statusCode === 200) {
      return res.data;
    }
    return false;
  };

  const sendReEvaluateRequestToJury = async (registrationId: string): Promise<unknown> => {
    const res = await api.post(`${REGISTRATION.SEND_RE_EVALUATE_REQUEST_TO_JURY}`, { registrationId });
    if (res.statusCode === 200) {
      showAlert(res.message, 'success');
      return true;
    }
    const errorMsg = res?.userMessage || mapErrorToUserMessage({ response: { data: res } });
    showAlert(errorMsg, 'error');
    return false;
  };

  const getRegistrationById = async (registrationId: string): Promise<any> => {
    const res = await api.get(`${REGISTRATION.GET_REGISTRATION_BY_ID}/${registrationId}`);
    if (res.statusCode === 200) {
      return res.data;
    }
    return false;
  };

  const cancelSeat = async (registrationId: string): Promise<any> => {
    const res = await api.post(`${REGISTRATION.CANCEL_SEAT(registrationId)}`);
    if (res.statusCode === 200) {
      showAlert(res.message, 'success');
      return res.data;
    }
    const errorMsg = res?.userMessage || mapErrorToUserMessage({ response: { data: res } });
    showAlert(errorMsg, 'error');
    return false;
  };

  return {
    create,
    getPastPassport,
    getUpcomingPassport,
    sendReEvaluateRequestToJury,
    getRegistrationById,
    cancelSeat,
  };
};

export default useRegistrationHook;
