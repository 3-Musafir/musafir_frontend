import api from '../pages/api';
import apiEndpoints from '../config/apiEndpoints';

const useRatingHook = () => {
  const { RATING } = apiEndpoints;

  const getTopFiveRating = async (flagshipId: string): Promise<any> => {  
    const res = await api.get(RATING.GET_TOP_FIVE.replace(':flagshipId', flagshipId));
    if (res.statusCode === 200) {
      return res.data;
    } else {
      return [];
    }
  };

  return {
    getTopFiveRating,
  };
};

export default useRatingHook;
