<template>
  <button
      class="button"
      :disabled="loading || disabled"
  >
    <span v-if="loading" class="spinner"></span>
    <slot />
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>