import api from "../pages/api";
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
    if (res.statusCode === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch user data");
    }
  };

  const updateUser = async (data: UpdateUserData): Promise<User> => {
    try {
      const res = await api.patch(USER.UPDATE_ME, data);
      if (res.statusCode === 200) {
        return res.data;
      } else {
        throw new Error("Failed to update user data");
      }
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  const resetPassword = async (
    data: ResetPasswordData
  ): Promise<{ message: string }> =>{
    try {
      const res = await api.post(USER.RESET_PASSWORD, data);
      return res.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  return {
    getMe,
    updateUser,
    resetPassword,
  };
};

export default useUserHandler;
