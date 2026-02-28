<template>
  <input ref="inputRef" :type="tipo" v-model="meuValor" :placeholder="textoPlaceHolder" :required="obrigatorio" class="auth-input" :maxlength="quantidade || 150" />
</template>

<script setup lang="ts">
import { ref } from "vue";
const meuValor = defineModel();

defineProps({
  tipo: { type: String, required: true },
  textoPlaceHolder: String,
  obrigatorio: { type: Boolean, required: true },
  quantidade: {type: Number},
});
const inputRef = ref<HTMLInputElement | null>(null);

defineExpose({
  inputRef,
});
</script>

<style scoped>
.auth-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.8em;
  margin-bottom: 1em;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #666;
  background-color: #2b2b2b;
  color: var(--cor-principal-fonte);
  transition: all 0.3s ease;
}
.auth-input:focus {
  border-color: #ff5722;
  box-shadow: 0 0 8px rgba(255, 87, 34, 0.7);
  outline: none;
}
</style>
