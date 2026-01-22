import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { currentUser } from '../store';
import api from '../pages/api';
import apiEndpoints from '../config/apiEndpoints';
import { SignupGoogleUser } from '@/interfaces/signup';
import { User } from '@/interfaces/login';

const useLoginHook = () => {
  const [user, setUser] = useRecoilState(currentUser);
  const { CREATE_GOOGLE, TOKEN_VERIFY } = apiEndpoints;
  const router = useRouter();

  const createGoogleUser = async (user: SignupGoogleUser): Promise<unknown> => {
    const userRes = await api.post(`${CREATE_GOOGLE}`, user);
    console.log(userRes);

    if (Object.keys(userRes).length > 0) {
      setUser(userRes.data.data);
    }
    return userRes;
  };

  const verifyToken = async (): Promise<User> => {
    const res = await api.get(`${TOKEN_VERIFY}`);
    const statusCode = (res as any)?.statusCode;
    const userData = (res as any)?.data ?? res;

    if (statusCode && statusCode !== 200) {
      router.push('/login');
      return userData;
    }

    if (userData) {
      setUser(userData);
    }

    return userData;
  };

  return {
    user,
    verifyToken,
    createGoogleUser,
  };
};

export default useLoginHook;
