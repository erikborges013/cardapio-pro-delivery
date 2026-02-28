<template>
  <div class="auth-container">
    <slot></slot>
  </div>
</template>

<style scoped>
.auth-container {
  background: linear-gradient(145deg, #2c2c2c, #3a3a3a);
  padding: 1.5rem 2rem;

  border-radius: 16px;
  color: var(--cor-principal-fonte);
  width: 90%;

  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 87, 34, 0.4);
  position: relative;
}

.auth-container::before {
  content: "";
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5em;
  animation: bounce 3s infinite ease-in-out;
  opacity: 0.8;
}
</style>
