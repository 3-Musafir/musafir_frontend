import api from "@/lib/api";
import apiEndpoints from "../config/apiEndpoints";
import { User } from "../interfaces/login";

interface ResetPasswordData {
  email: string;
  previousPassword: string;
  password: string;
  confirmPassword: string;
}

interface UpdateUserData {
  fullName?: string;
  phone?: string;
  cnic?: string;
  city?: string;
  university?: string;
  employmentStatus?: 'student' | 'employed' | 'selfEmployed' | 'unemployed';
  socialLink?: string;
  gender?: string;
  profileImg?: string;
}

const useUserHandler = () => {
  const { USER } = apiEndpoints;

  const getMe = async (): Promise<User> => {
    const res = await api.get(USER.GET_ME);
    return res.data;
  };

  const getVerificationStatus = async (): Promise<string | undefined> => {
    try {
      const res = await api.get('/user/verification-status');
      return res?.data?.status;
    } catch (error) {
      const user = await getMe();
      return (user as any)?.verification?.status;
    }
  };

  const updateUser = async (data: UpdateUserData): Promise<User> => {
    const res = await api.patch(USER.UPDATE_ME, data);
    return res.data;
  };

  const resetPassword = async (
    data: ResetPasswordData
  ): Promise<{ message: string }> => {
    const res = await api.post(USER.RESET_PASSWORD, data);
    return res.data;
  };

  return {
    getMe,
    getVerificationStatus,
    updateUser,
    resetPassword,
  };
};

export default useUserHandler;
