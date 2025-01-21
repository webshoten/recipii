export const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000/`;
  }
  return `https://${process.env.VERCEL_URL}/`;
};
