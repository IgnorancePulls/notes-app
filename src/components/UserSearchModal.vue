<template>
  <div
      v-if="isModalVisible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <div class="flex justify-end">
        <button
            @click="handleClose"
            class="inline-flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            aria-label="Close"
        >
          Close
        </button>
      </div>
      <div class="mt-4 relative">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Type user name"
            class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
            @input="handleSearch"
            ref="inputRef"
        />
        <div
            v-if="filteredUsers.length"
            class="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          <ul>
            <li
                v-for="user in filteredUsers"
                :key="user.username"
                class="p-3 hover:bg-blue-50 cursor-pointer text-left"
                @click="handleUserClick(user)"
            >
              <span class="font-medium text-gray-800"
              >{{ user.first_name }} {{ user.last_name }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch, nextTick} from 'vue';

import { useUsersStore } from "@/store/useUsersStore.ts";
import { findRelevantUsers } from "@/utils/find-user.ts";
import { User } from "@/types/user.ts";

const usersStore = useUsersStore();
const searchQuery = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const filteredUsers = computed(() => {
  return findRelevantUsers(searchQuery.value, usersStore.usersList.value);
})

const {isModalVisible, onClose, onUserClick } = defineProps({
  isModalVisible: Boolean,
  onClose: Function,
  onUserClick: Function,
});

const resetState = () => {
  searchQuery.value = '';
  filteredUsers.value = [];
}

const handleClose = () => {
  resetState();
  if(onClose) {
    onClose();
  }
}

const handleUserClick = (user: User) => {
  resetState();
  if(onUserClick) {
    onUserClick(user);
  }
}

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
};

watch(() => isModalVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(async () => {
  await usersStore.getUsersList()
})

watch(()=> isModalVisible, (newValue) => {
  if (newValue) {
    nextTick(() => {
      inputRef.value && inputRef.value.focus();
    })
  }
})
</script>
