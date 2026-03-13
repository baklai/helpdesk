export const dateToStr = value => {
  return value ? new Date(value).toLocaleDateString() : value;
};

export const dateToMonthStr = value => {
  if (!value) return;
  const date = new Date(value);
  const formatter = new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' });
  return formatter.format(date);
};

export const dateToMonthPeriodStr = value => {
  if (!value) return;

  const currentDate = new Date(value);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();

  return `з 01.${String(month).padStart(2, '0')}.${year} по ${lastDay}.${String(month).padStart(2, '0')}.${year} р.`;
};

export const dateToLocaleStr = (value, locale = 'uk-UA') => {
  return value
    ? new Date(value).toLocaleDateString(locale, {
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : value;
};

export const dateTimeToEventStr = (value, locale = 'uk-UA') => {
  const date = new Date(value);

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const dateTimeToStr = value => {
  return value ? new Date(value).toLocaleString() : value;
};

export const unixDateTimeToStr = value => {
  return value ? new Date(value * 1000).toLocaleString() : value;
};

export const strToDate = value => {
  if (!value?.length) return '-';
  return [value?.slice(0, 4), '/', value?.slice(4, 6), '/', value?.slice(6)].join('');
};
