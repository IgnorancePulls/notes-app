import { ref, Ref } from 'vue';

import { fetchUsers } from '@/api/users.ts';
import { User } from '@/types/user.ts';
import { findRelevantUsers } from '@/utils/find-user.ts';

interface UsersStore {
  usersList: Ref<null | User[]>;
  getUsersList: () => Promise<void>;
  isModalVisible: Ref<boolean>;
  isUsersLoading: Ref<boolean>;
  isSearching: Ref<boolean>;
  searchUsers: (query: string) => User[] | [];
}
const useUsersStore = (): UsersStore => {
  const usersList = ref<null | User[]>(null);
  const isModalVisible = ref(false);
  const isUsersLoading = ref(false);
  const isSearching = ref(false);

  const getUsersList = async (): Promise<void> => {
    if (usersList.value?.length) {
      return;
    }

    usersList.value = await fetchUsers();
  };

  const searchUsers = (query: string): User[] | [] => {
    return findRelevantUsers(query, usersList.value || []);
  };

  return {
    usersList,
    getUsersList,
    isModalVisible,
    isUsersLoading,
    isSearching,
    searchUsers,
  };
};

export { useUsersStore };
