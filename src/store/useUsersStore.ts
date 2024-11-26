import { ref} from 'vue';
import { fetchUsers } from "@/api/users.ts";
import { User } from "@/types/user.ts";
import { findRelevantUsers } from "@/utils/find-user.ts";
const useUsersStore = () => {
    const usersList = ref<null | User[]>(null);
    const isModalVisible = ref(false);
    const isUsersLoading = ref(false);
    const isSearching = ref(false);

    const getUsersList = async () => {
        if(usersList.value?.length) {
            return;
        }

        usersList.value = await fetchUsers();
    }

    const searchUsers = (query: string) => {
        return findRelevantUsers(query, usersList.value || []);
    }

    return {
        usersList,
        getUsersList,
        isModalVisible,
        isUsersLoading,
        isSearching,
        searchUsers
    }
}

export { useUsersStore };