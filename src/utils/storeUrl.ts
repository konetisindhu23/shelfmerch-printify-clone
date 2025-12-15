const STORE_BASE_URL =
  import.meta.env.VITE_STORE_BASE_URL || 'http://localhost:8080';

export const getStoreUrl = (subdomain: string) => {
  // Localhost → route-based store
  if (STORE_BASE_URL.includes('localhost')) {
    return `${STORE_BASE_URL}/store/${subdomain}`;
  }

  // Production → subdomain-based store
  const hostname = new URL(STORE_BASE_URL).hostname;
  return `https://${subdomain}.${hostname}`;
};
