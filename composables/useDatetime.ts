import { format } from 'date-fns';

export const useDatetime = () => {
  const dateToHour = (hour: string, date: Date) => {
    const hourFormatted = Number(hour.split(':')[0]);
    const minFormatted = Number(hour.split(':')[1]);
    const newDate = new Date(date);
    newDate.setHours(hourFormatted, minFormatted);
    return format(newDate, 'HH:mm');
  };

  return {
    dateToHour,
  };
};
