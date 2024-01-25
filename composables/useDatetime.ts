import { format } from 'date-fns';

export const useDatetime = () => {
  const setHourInDate = (hour: string, date: Date) => {
    const hourFormatted = Number(hour.split(':')[0]);
    const minFormatted = Number(hour.split(':')[1]);
    const newDate = new Date(date);
    newDate.setHours(hourFormatted, minFormatted);
    return format(newDate, 'HH:mm');
  };
  const isSameOrBeforeHour = (firstTime: string, secondTime: string) => {
    const hours1 = Number(firstTime.split(':')[0]);
    const minutes1 = Number(firstTime.split(':')[1]);
    const hours2 = Number(secondTime.split(':')[0]);
    const minutes2 = Number(secondTime.split(':')[1]);

    if (hours1 > hours2 || (hours1 === hours2 && minutes1 > minutes2)) {
      return 1; // date1 is later than date2
    } else if (hours1 < hours2 || (hours1 === hours2 && minutes1 < minutes2)) {
      return -1; // date1 is earlier than date2
    } else {
      return 0; // date1 and date2 are at the same time
    }
  };
  return {
    setHourInDate,
    isSameOrBeforeHour,
  };
};
