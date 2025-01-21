export const getBaseUrl = () => {
  return process.env.NEXT_DEPLOYMENT_URL || '';
};
