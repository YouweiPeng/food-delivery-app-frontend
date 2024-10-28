import { format, addDays, startOfWeek } from 'date-fns';

export const getWeekDates = () => {
  const today = new Date();
  if (today.getHours() >= 10) {
    today.setTime(today.getTime() + (24 * 60 * 60 * 1000));
  }
  // today.setTime(today.getTime() + (78 * 24 * 60 * 60 * 1000))
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1) >= 10? today.getMonth() + 1:'0' + (today.getMonth() + 1)}-${ today.getDate() >= 10? today.getDate():'0'+ today.getDate()}`;
  const thisMonday = startOfWeek(today, { weekStartsOn: 1 });
  
  const thisWeek = Array.from({ length: 7 }, (_, i) => addDays(thisMonday, i));
  const nextWeek = Array.from({ length: 7 }, (_, i) => addDays(thisMonday, 7 + i));

  return {
    thisWeek: thisWeek.map(date => ({ label: format(date, 'yyyy-MM-dd (EEEE)'), date: format(date, 'yyyy-MM-dd') })),
    nextWeek: nextWeek.map(date => ({ label: format(date, 'yyyy-MM-dd (EEEE)'), date: format(date, 'yyyy-MM-dd') })),
    today: today,
    formattedDate: formattedDate
  };
};

export const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
