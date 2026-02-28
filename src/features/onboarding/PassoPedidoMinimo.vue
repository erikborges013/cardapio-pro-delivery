<template>
    <section class="flex flex-col gap-4 pt-10 w-[90%]">
        <h1 class="text-center">Digite o Pedido mínimo para entrega</h1>
        <baseInput :texto-place-holder="'Exemplo: 10'" :widthPequeno="true" :tipo="'number'" step="0.01" :obrigatorio="true"
            v-model="dados.pedidoMinimo" />
    </section>
</template>

<script setup lang="ts">
import baseInput from '../../components/ui/BaseInput.vue';
    const dados = defineModel<{pedidoMinimo: number}>({required: true});

</script>