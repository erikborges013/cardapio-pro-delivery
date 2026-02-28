<template>
  <button type="submit" class="auth-button" :disabled="desativarBotao">{{ texto }}</button>
</template>

<script setup lang="ts">
defineProps({
  texto: { type: String, riquered: true },
  desativarBotao: {type: Boolean, default: false},
});
</script>

<style scoped>
.auth-button {
  width: 100%;
  padding: 0.9em;
  border: none;
  border-radius: 25px;
  background: linear-gradient(45deg, #ff5722, #ffc107);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1em;
  transition: transform 0.2s, box-shadow 0.2s;
}


.auth-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(255, 87, 34, 0.7);
}
</style>
