import axiosAuth from '@/axios/instant';
import { User } from '@/types/user';
import { toast } from 'sonner';

export const fetchUserInfomation = async ({
  setUser,
}: {
  setUser: (userData: User | null) => void;
}) => {
  try {
    const res = await axiosAuth.get('/user/profile');
    const me = res.data.data;
    setUser(me);
  } catch (error) {
    toast.error('Failed to fetch user information');
  }
};
