export const setItemWithExpiry = (key, value, ttlMinutes = 24 * 60) => {
  const now = new Date();
  const ttlMilliseconds = ttlMinutes * 60 * 1000; // Convert minutes to milliseconds
  const item = {
    value: value,
    expiry: now.getTime() + ttlMilliseconds,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getItemWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);

  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};
