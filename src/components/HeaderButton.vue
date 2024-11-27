<template>
  <button
      class="inline-flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
      :disabled="loading || disabled"
  >
    <span
        v-if="loading"
        class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
    ></span>
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