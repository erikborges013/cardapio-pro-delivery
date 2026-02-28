<template>
    <button class="botao-editar" @click="$emit('confirmar')"><img :src="iconeEditar" alt="icone"
            class="icone-editar"></button>
</template>

<script setup lang="ts">
import iconeEditar from "../../../assets/icone-editar.svg"
defineEmits(['confirmar']);
</script>

<style scoped>
.botao-editar {
    background-color: rgb(0, 195, 255);
    border-radius: 5px;
    cursor: pointer;
    border: none;
}

.icone-editar {
    width: 22px;
}
</style>