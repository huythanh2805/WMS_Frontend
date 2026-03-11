// src/lib/tokenStorage.ts

export const setAccessToken = (accessToken: string | null): void => {
  document.cookie = `accessToken=${accessToken}; path=/; secure; sameSite=strict`;
};

export const getAccessToken = (): string | null | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; accessToken=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
};

export const clearAccessToken = (): void => {
  document.cookie =
    'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; sameSite=strict';
};
