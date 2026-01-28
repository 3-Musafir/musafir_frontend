import api from '@/lib/api';
import apiEndpoints from '../config/apiEndpoints';

const useFaqHook = () => {
  const { FAQ } = apiEndpoints;

  const getFaq = async (): Promise<any> => {  
    const res = await api.get(FAQ.GET);
    if (res.statusCode === 200) {
      return res.data;
    } else {
      return [];
    }
  };

  return {
    getFaq,
  };
};

export default useFaqHook;
