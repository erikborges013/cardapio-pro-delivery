<template>
    <button class="botao-excluir" @click="$emit('confirmar')"><img :src="iconeDelete" alt="icone"
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
}

.icone-delete {
    width: 22px;
}
</style>