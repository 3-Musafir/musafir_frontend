import { HttpStatusCode } from 'axios';
import api from '@/pages/api';
import apiEndpoints from '@/config/apiEndpoints';
import { showAlert } from '@/pages/alert';
import { CompanyProfile } from '@/services/types/companyProfile';

type UpdatePayload = {
  name?: string;
  description?: string;
  logoFile?: File | null;
};

const useCompanyProfile = () => {
  const getProfile = async (): Promise<CompanyProfile | null> => {
    const res = await api.get(apiEndpoints.COMPANY_PROFILE.GET);
    return (res as any)?.data ?? null;
  };

  const updateProfile = async (payload: UpdatePayload): Promise<CompanyProfile | null> => {
    const formData = new FormData();

    if (payload.name !== undefined) {
      formData.append('name', payload.name);
    }
    if (payload.description !== undefined) {
      formData.append('description', payload.description);
    }
    if (payload.logoFile) {
      formData.append('logo', payload.logoFile);
    }

    const res = await api.put(
      apiEndpoints.COMPANY_PROFILE.UPDATE,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    if (res?.statusCode === HttpStatusCode.Ok) {
      showAlert(res?.message || 'Company profile saved', 'success');
    }

    return (res as any)?.data ?? null;
  };

  return { getProfile, updateProfile };
};

export default useCompanyProfile;
