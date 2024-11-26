<template>
  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal">
      <button @click="handleClose" class="close-modal-btn">Close</button>
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Type user name"
          class="search-input"
          @input="handleSearch"
          ref="inputRef"
      />
      <div class="user-list" v-if="filteredUsers.length">
        <div
            v-for="user in filteredUsers"
            :key="user.username"
            class="user-item"
            @click="handleUserClick(user)"
        >
          {{ user.first_name }} {{ user.last_name }}
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

// Watch for modal visibility changes
watch(() => isModalVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'; // Disable scrolling
  } else {
    document.body.style.overflow = ''; // Restore scrolling
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

<style scoped>
/* Overlay to cover the entire page */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dark transparent overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal content */
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  position: relative;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button:focus {
  outline: none;
}

.user-list {
  min-height: 120px;
  margin-top: 10px;
  position: absolute;
  background: #fff;
  left: 0;
  right: 0;
  border-radius: 4px;
  padding: 20px;
}

.user-item {
  text-align: left;
  padding: 4px 16px;
  &:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
}

.close-modal-btn {
  margin-top: 0;
  margin-left: auto;
  display: block;
  margin-bottom: 8px;
}
</style>
