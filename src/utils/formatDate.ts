const getDaySuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export const formatDate = (startDate: string, endDate: string) => {
  const startDay = new Date(startDate).getDate();
  const endDay = new Date(endDate).getDate();
  const month = new Date(endDate).toLocaleString('default', { month: 'long' });
  const year = new Date(endDate).getFullYear();
  return `${startDay}-${endDay}${getDaySuffix(endDay)} ${month} ${year}`;
};
