// types/user.ts
export interface User {
  id: string;
  name?: string | null;
  email: string;
  about?: string | null;
  industryType?: string | null;
  roleType?: string | null;
  country?: string | null;
  image?: string | null;
  // Nếu sau này API trả thêm field nào thì cứ bổ sung vào đây
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (userData: User | null) => void;
  clearUser: () => void;
  startLoading: () => void;
  setError: (msg: string | null) => void;

  // helper tiện lợi
  updateUserField: <K extends keyof User>(field: K, value: User[K]) => void;
}
