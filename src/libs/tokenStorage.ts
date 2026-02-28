// src/lib/tokenStorage.ts

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  console.log("AccessToken đã được cập nhật:", accessToken);
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};