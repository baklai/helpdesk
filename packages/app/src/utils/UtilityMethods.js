export const ArrayToString = classes => {
  return classes
    .map(item => {
      if (typeof item === 'string') {
        return item;
      }
      if (typeof item === 'object') {
        return Object.keys(item)
          .filter(key => item[key])
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
};

export const RgbaColorsGen = count => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    colors.push({ backgroundColor: rgbaColor, borderColor: rgbColor });
  }
  return colors;
};

export const capitalizeFirstLetter = str => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getObjField = (obj, path, defaultValue = null) => {
  const keys = path.split('.');
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]];
    if (obj === undefined || obj === null) return defaultValue;
  }
  return obj;
};

export const byteToStr = value => {
  if (!Number(value)) return '-';
  const index = Math.floor(Math.log(Number(value)) / Math.log(1024));
  return (
    (Number(value) / Math.pow(1024, index)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][index]
  );
};

export const isIP = value => {
  if (typeof value !== 'string') return false;

  const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

  return ipRegex.test(value.trim());
};
