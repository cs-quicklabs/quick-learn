import { getAccessTokenFromLocalStorage } from './localStorageUtils';

export const isUserAuthenticated = () => {
  return Boolean(getAccessTokenFromLocalStorage());
};
