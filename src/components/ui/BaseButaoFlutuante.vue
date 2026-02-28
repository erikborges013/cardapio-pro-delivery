<template>
    <div class="container-botao-cadastrar-novo-produto">
        <button @click="$emit('abrirFormulario')" class="botao-cadastrar-novo-produto">{{ texto }}</button>
    </div>
    
</template>

<script setup lang="ts">
    defineEmits(['abrirFormulario']);
const props = defineProps({
    texto: { type: String, required: true },
})
</script>


<style lang="scss" scoped>
@reference "../../assets/tailwind.css";
.botao-cadastrar-novo-produto {
  @apply fixed bottom-5 right-5 z-[1000] w-28 p-2.5 rounded-md font-bebas cursor-pointer;
  @apply bg-gradient-to-r from-[#ff5722] to-[#ffc107] text-white;
  transition: transform 0.2s;

  &:hover {
    @apply scale-105 shadow-lg;
  }
}
</style>