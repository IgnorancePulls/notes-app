<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700">
    <h1 class="text-9xl font-extrabold text-red-500">404</h1>
    <p class="text-xl mt-4">Page not found</p>
    <button
        class="mt-6 px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        @click="goToHome"
    >
      Go to Homepage
    </button>
  </div>
</template>

<script setup>
const goToHome = () => {
  window.location.href = '/';
};
</script>
