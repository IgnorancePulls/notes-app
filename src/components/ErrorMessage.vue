<template>
  <div v-if="errorMessage" class="my-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-sm animate-fade-in">
    <p class="font-medium text-center">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  errorMessage: string;
}>();

</script>
<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}

</style>