import api from '@/lib/api';
import apiEndpoints from '../config/apiEndpoints';
import { BaseRegistration } from '@/interfaces/registration';
import { showAlert } from '@/pages/alert';
import { mapErrorToUserMessage } from '@/utils/errorMessages';

export interface RegistrationCreationResponse {
  registrationId: string;
  message: string;
  alreadyRegistered?: boolean;
  isPaid?: boolean;
  status?: string;
  amountDue?: number;
  linkConflicts?: { email: string; reason: 'already_in_another_group' | 'already_invited' }[];
  groupDiscount?: {
    status: 'applied' | 'not_eligible' | 'budget_exhausted' | 'disabled';
    perMember: number;
    groupSize: number;
  };
}

const useRegistrationHook = () => {
  const { REGISTRATION } = apiEndpoints;

  const create = async (data: BaseRegistration): Promise<RegistrationCreationResponse> => {
    const res = await api.post(`${REGISTRATION.CREATE}`, data);
    return res as RegistrationCreationResponse;
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

  const getGroupLinkStatus = async (registrationId: string): Promise<any> => {
    const res = await api.get(`/registration/group-link-status/${registrationId}`);
    if (res.statusCode === 200) {
      return res.data;
    }
    return false;
  };

  const getPendingGroupInvite = async (flagshipId: string): Promise<any> => {
    const res = await api.get(`/registration/pending-group-invite/${flagshipId}`);
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
    getGroupLinkStatus,
    getPendingGroupInvite,
    cancelSeat,
  };
};

export default useRegistrationHook;
