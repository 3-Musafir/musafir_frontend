// import { useRecoilState } from 'recoil';
import { BaseUser, SignupUser } from '@/interfaces/signup';
import { useRouter } from 'next/router';
import apiEndpoints from '../config/apiEndpoints';
import api from '../pages/api';

const useSignUpHook = () => {
  // const [user, setUser] = useRecoilState(currentUser);
  const { SIGNUP, LOGOUT, VERIFY_EMAIL, CHECK_EMAIL_AVAILABILITY } = apiEndpoints;
  const router = useRouter();

  const register = async (user: BaseUser): Promise<unknown> => {
    console.log("[useSignUp] Register API call started", {
      endpoint: SIGNUP,
      payloadPreview: {
        email: (user as SignupUser)?.email,
        fullName: (user as SignupUser)?.fullName,
        hasPassword: Boolean((user as SignupUser)?.password),
      },
    });
    const data = await api.post(`${SIGNUP}`, user);
    console.log("[useSignUp] Register API response", {
      success: Boolean(data),
      keys: data ? Object.keys(data) : [],
    });

    // if (Object.keys(data).length > 0) {
    //   setUser(data);
    // }
    return data;
  };

  const verifyEmail = async (password: string, verificationId: string): Promise<unknown> => { 
    const data = await api.post(`${VERIFY_EMAIL}`, { password, verificationId });
    if (data) {
      return data;
    } else {
      console.log("error verifying the email")
    }
  }

  // const verifyUser = async (): Promise<unknown> => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   const data = await api.post(`${TOKEN_VERIFY}`, { token: accessToken }, {});
  //   if (Object.keys(data).length > 0) {
  //     setUser(data);
  //   }
  //   return data;
  // };

  const logout = async () => {
    await api.get(LOGOUT);
    localStorage.clear();
    router.replace('/');
  };

  const checkEmailAvailability = async (email: string) => {
    const encodedEmail = encodeURIComponent(email);
    const data = await api.get(`${CHECK_EMAIL_AVAILABILITY}?email=${encodedEmail}`);
    return data;
  };

  return {
    // user,
    checkEmailAvailability,
    logout,
    register,
    verifyEmail,
  };
};

export default useSignUpHook;
