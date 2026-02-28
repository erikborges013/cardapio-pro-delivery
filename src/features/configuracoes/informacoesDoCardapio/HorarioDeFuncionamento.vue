<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  label: string;
  modelValue?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const [h, m] = props.modelValue ? props.modelValue.split(':') : ['18', '00'];

const hora = ref(parseInt(h));
const minuto = ref(parseInt(m));

watch([hora, minuto], () => {
  const hh = hora.value.toString().padStart(2, '0');
  const mm = minuto.value.toString().padStart(2, '0');
  emit('update:modelValue', `${hh}:${mm}`);
}, {immediate: true});

const ajustar = (tipo: 'h' | 'm', valor: number) => {
  if (tipo === 'h') {
    hora.value = (hora.value + valor + 24) % 24;
  } else {
    minuto.value = (minuto.value + valor + 60) % 60;
  }
};
</script>

<template>
  <div class="time-picker-wrapper">
    <label class="text-yellow-400 text-sm mb-2 block">{{ label }}</label>
    
    <div class="flex items-center justify-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
      <div class="flex flex-col items-center">
        <button @click="ajustar('h', 1)" class="btn-seta">▲</button>
        <span class="num-display">{{ hora.toString().padStart(2, '0') }}</span>
        <button @click="ajustar('h', -1)" class="btn-seta">▼</button>
      </div>

      <span class="text-2xl font-bold text-white">:</span>

      <div class="flex flex-col items-center">
        <button @click="ajustar('m', 5)" class="btn-seta">▲</button>
        <span class="num-display">{{ minuto.toString().padStart(2, '0') }}</span>
        <button @click="ajustar('m', -5)" class="btn-seta">▼</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@reference "../../../assets/tailwind.css";

.btn-seta {
  @apply text-yellow-500 p-0 hover:text-yellow-300 transition-colors text-xl active:scale-90;
}

.num-display {
  // Mantendo o estilo de sombra amarela do seu projeto
  @apply text-4xl font-mono font-bold text-white my-2;
  text-shadow: 0 0 10px rgba(255, 235, 59, 0.3);
}

.time-picker-wrapper {
  @apply w-full max-w-[200px] mx-auto;
}
</style>