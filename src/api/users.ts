import apiClient from '@/api/axios.ts';
import { User } from '@/types/user.ts';

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('', {
    baseURL: 'https://challenge.surfe.com/users',
  });

  return data;
};

export { fetchUsers };
