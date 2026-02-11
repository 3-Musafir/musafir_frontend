import { BaseFlagShip, IFlagshipFilter } from '@/interfaces/flagship';
import { showAlert } from '@/pages/alert';
import { currentFlagship, filterFlagships } from '@/store/flagship';
import { mapErrorToUserMessage } from '@/utils/errorMessages';
import { HttpStatusCode } from 'axios';
import { useRecoilState } from 'recoil';
import apiEndpoints from '../config/apiEndpoints';
import api from '@/lib/api';

const useFlagshipHook = () => {
  // const [user, setUser] = useRecoilState(currentUser);
  const [currentFlagshipData, setCurrentFlagshipData] = useRecoilState(currentFlagship);
  const [filteredFlagshipsData, setFilteredFlagshipsData] = useRecoilState(filterFlagships);
  const { FLAGSHIP } = apiEndpoints;

  const create = async (data: BaseFlagShip): Promise<unknown> => {
    const res = await api.post(`${FLAGSHIP.CREATE}`, data);
    console.log(res, 'dataaa');
    setCurrentFlagshipData({});
    if (res.statusCode === HttpStatusCode.Created) {
      showAlert(res?.data?.message || 'Flagship created!', 'success');
      setCurrentFlagshipData(res.data);
    }
    return res;
  };

  const update = async (id: string, data: any): Promise<unknown> => {
    const isFormData = data instanceof FormData;
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};

    const res = await api.put(`${FLAGSHIP.UPDATE}/${id}`, data, config);
    if (res.statusCode === HttpStatusCode.Ok) {
      setCurrentFlagshipData(res.data);
    }
    return res;
  };

  const updateWithLatestVersion = async (id: string, data: any): Promise<unknown> => {
    if (!id) {
      return update(id, data);
    }

    let latest: any;
    try {
      latest = await api.get(`${FLAGSHIP.GET}/${id}`);
    } catch (error: any) {
      throw {
        ...error,
        message: 'Unable to refresh trip. Please retry.',
      };
    }

    const latestVersion = latest?.contentVersion;
    let payload = data;

    if (data instanceof FormData) {
      if (latestVersion) {
        data.set('contentVersion', latestVersion);
      }
    } else if (data && typeof data === 'object') {
      payload = {
        ...data,
        contentVersion: latestVersion ?? data.contentVersion,
      };
    }

    return update(id, payload);
  };

  const filterFlagship = async (data: IFlagshipFilter): Promise<unknown> => {
    const res = await api.get(`${FLAGSHIP.FILTER}/`, data);
    if (res.statusCode === HttpStatusCode.Ok) {
      setFilteredFlagshipsData(res?.data);
    }
    return res.data;
  };

  const getFlagship = async (flagshipId: string): Promise<any> => {
    const flagship = await api.get(`${FLAGSHIP.GET}/${flagshipId}`)
    if (flagship) {
      return flagship;
    } else {
      console.log("unable to fetch the flagship")
    }
  }

  const getAllFlagships = async (): Promise<any> => {
    try {
      const filterParams = {
        visibility: 'public',
        status: 'published'
      };
      const response = await api.get(`${FLAGSHIP.FILTER}`, filterParams);
      if (response.statusCode === HttpStatusCode.Ok) {
        setFilteredFlagshipsData(response?.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching flagships:', error);
      showAlert(mapErrorToUserMessage(error), 'error');
    }
  }

  const sendTripQuery = async (tripQuery: string, flagshipId: string) => {
    const res = await api.post(`${FLAGSHIP.TRIP_QUERY}`, { query: tripQuery, flagshipId });
    return res;
  }

  return {
    create,
    update,
    updateWithLatestVersion,
    filterFlagship,
    currentFlagshipData,
    filteredFlagshipsData,
    getFlagship,
    getAllFlagships,
    sendTripQuery,
  };
};

export default useFlagshipHook;
