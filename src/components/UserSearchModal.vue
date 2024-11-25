<template>
  <div v-if="isModalVisible" class="modal-overlay">
    <div class="modal">
      <button @click="onClose">Close</button>
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Type user name"
          class="search-input"
          @input="handleSearch"
      />
      <ul class="user-list">
        <li
            v-for="user in filteredUsers"
            :key="user.username"
            class="user-item"
            @click="onUserClick(user)"
        >
          {{ user.first_name }} {{ user.last_name }}
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup>
import {computed, onMounted, ref, watch} from 'vue';

import { useUsersStore } from "@/store/useUsersStore.ts";
import { findRelevantUsers } from "@/utils/find-user.ts";

const usersStore = useUsersStore();
const searchQuery = ref('');

const filteredUsers = computed(() => {
  return findRelevantUsers(searchQuery.value, usersStore.usersList.value);
})

const {isModalVisible} = defineProps({
  isModalVisible: Boolean,
  onClose: Function,
  onUserClick: Function,
});

const handleSearch = (event) => {
  searchQuery.value = event.target.value;
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
</style>
