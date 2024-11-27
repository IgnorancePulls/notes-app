<template>
  <div class="page-not-found">
    <h1>404</h1>
    <p>Page not found</p>
    <button onclick="window.location.href='/'">Go to Homepage</button>
  </div>
</template>

<style scoped>
.page-not-found {
  text-align: center;
}

.page-not-found h1 {
  font-size: 6rem;
  font-weight: bold;
  color: #ff6b6b; /* Bright red for the error code */
  margin: 0;
}

.page-not-found p {
  font-size: 1.5rem;
  color: #555; /* Neutral secondary text */
  margin: 1rem 0;
}

</style>