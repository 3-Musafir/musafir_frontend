// import { useRecoilState } from 'recoil';
// import { useRouter } from 'next/router';
// import { currentUser } from '../../store';
import api from '@/lib/api';
import apiEndpoints from '../config/apiEndpoints';
import { RequestVerification } from '@/interfaces/verificarion';

const useVerificationHook = () => {
  const { REQUEST_VERIFICATION } = apiEndpoints;
  // const router = useRouter();

  const requestVerification = async (formData: FormData): Promise<unknown> => {
    const data = await api.post(`${REQUEST_VERIFICATION}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  };

  return {
    requestVerification,
  };
};

export default useVerificationHook;
