export const setToken = (request): string => {
  return request.cookies.token || request.headers.authorization?.split(' ')[1];
};
