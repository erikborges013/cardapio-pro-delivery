<template>
  <div id="preloader">
    <div class="spinner">
      <video autoplay loop muted playsinline width="150">
        <source :src="pizzaLoad" type="video/webm" />
      </video>
    </div>
  </div>
</template>

<script setup lang="ts">
  import pizzaLoad from "../../../assets/pizza-loop.webm";
</script>

<style scoped>
#preloader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
