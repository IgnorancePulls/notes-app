<template>
  <div class="notification-error" v-if="errorMessage">
    <p class="notificationMessage">{{errorMessage}}</p>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  errorMessage: string;
}>();

</script>
<style scoped>
.notification-error {
  margin: 1rem 0;
  padding: 1rem;
  color: #fff;
  background-color: #d32f2f; /* Red background for error */
  border: 1px solid #b71c1c; /* Darker red border */
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>