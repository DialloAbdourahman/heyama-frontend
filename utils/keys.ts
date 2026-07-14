export const KEYS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  WEB_SOCKET_URL: process.env.NEXT_PUBLIC_WEB_SOCKET_URL,
  MAX_IMAGE_SIZE_IN_MB: process.env.NEXT_MAX_IMAGE_SIZE_IN_MB
    ? parseInt(process.env.NEXT_MAX_IMAGE_SIZE_IN_MB)
    : 5,
};
