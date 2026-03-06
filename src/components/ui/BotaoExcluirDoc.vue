<template>
    <button class="flex justify-center items-center botao-excluir" @click="$emit('confirmar')"><img :src="iconeDelete" alt="icone"
            class="icone-delete"></button>
</template>

<script setup lang="ts">
import iconeDelete from "../../../assets/icone-delete.svg";
defineEmits(['confirmar']);
</script>

<style scoped>
.botao-excluir {
    background-color: red;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    height: 75px;
    max-height: 75px;
    min-width: 30px;
}

.icone-delete {
    width: 22px;
    max-height: 22px;
}
</style>