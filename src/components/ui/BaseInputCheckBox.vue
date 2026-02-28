<template>
  <label class="flex items-center gap-2 cursor-pointer relative">
    
    <input 
      type="checkbox" 
      v-model="model" 
      :value="value ?? 'checkbox'"
    />
    
    <span class="caixa"></span>
    
    <slot />
  </label>
</template>

<script setup lang="ts">
// O defineModel já lida automaticamente com a atualização do pai
const model = defineModel<Boolean | String[]>();

defineProps({
  value: String,
  id: String
});
</script>

<style lang="scss" scoped>
@reference "../../assets/tailwind.css";

input {
  @apply sr-only;

  /* Lógica: Quando o input (vizinho anterior) estiver checado, aplica estilo na .caixa */
  &:checked + .caixa {
    @apply bg-green-500 border-green-500;

    &::after {
      @apply opacity-100;
    }
  }
}

.caixa {
  @apply w-5 h-5
         border-2 border-zinc-400
         rounded /* Adicionei arredondamento para ficar mais bonito, opcional */
         relative
         flex items-center justify-center /* Centraliza o check */
         transition-colors duration-200 ease-in-out /* Suaviza a cor */
         flex-shrink-0;

  &::after {
    content: "";
    @apply w-[6px] h-[10px] /* Ajustei levemente as medidas */
           border-white border-r-2 border-b-2
           rotate-45 opacity-0
           transition-opacity duration-200; /* Suaviza o aparecimento do check */
    
    /* Ajuste de posição para ficar bem no centro */
    margin-bottom: 2px; 
  }
}
</style>