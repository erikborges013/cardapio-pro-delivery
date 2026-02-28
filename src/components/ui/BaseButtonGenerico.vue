<template>
  <button :disabled="botaoEstaAtivo" :type="tipo ?? 'button'" id="btn-copiar-link" :class="{ buttonMaisLargo: status }"
>{{ texto }}</button>
</template>

<script setup lang="ts">

defineProps<{
  texto: string,
  tipo?: 'button' | 'submit' | 'reset',
  botaoEstaAtivo?: boolean,
  status?: boolean,
}>()
</script>

<style lang="scss" scoped>
@reference "../../assets/tailwind.css";

#btn-copiar-link {
  @apply p-4 border-none rounded-[15px] cursor-pointer text-base font-normal transition-transform transition-shadow duration-200 disabled:opacity-60 disabled:cursor-not-allowed font-bebas;
  color: rgb(255, 255, 255);
  background: linear-gradient(45deg, #ff5722, #ffc107);

  &:hover {
    @apply scale-105;
    box-shadow: 0 0 12px rgba(255, 87, 34, 0.7);
  }

  &:disabled {
    @apply transform-none shadow-none;
  }
}

.buttonMaisLargo {
  @apply w-full lg:w-50;
}
</style>
