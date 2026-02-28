<template>
    <section class="flex flex-col gap-4 pt-20 w-[90%]">
        <h1 class="text-center">Qual o tempo estimado para entrega e retirada?</h1>
        <TempoEstimadoSelect v-model:dados="dados" />
    </section>
</template>

<script setup lang="ts">
import TempoEstimadoSelect from '../configuracoes/informacoesDoCardapio/TempoEstimadoSelect.vue';

const dados = defineModel<{horaEstimadaEntrega: string, minutosEstimadoEntrega: string, horaEstimadaRetirada: string, minutosEstimadoRetirada: string}>({required: true});


</script>