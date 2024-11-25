import { User } from "@/types/user.ts";
import apiClient from "@/api/axios.ts";

const fetchUsers = async (): Promise<User[]> => {
    const { data } = await apiClient.get(``, {
        baseURL: 'https://challenge.surfe.com/users',
    });

    return data;
};

export { fetchUsers };