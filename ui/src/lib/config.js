const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX || 'v1';
  return `${apiUrl}/${apiPrefix}`;
};

export const API_CONFIG = {
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};
