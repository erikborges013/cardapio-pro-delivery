<template>
    <section class="flex flex-col gap-1 pt-10 w-[90%]">
        <h1 class="text-center pb-10">Quais são os dias de funcionamento?</h1>
        <DiasFuncionamento v-model:dias-selecionados="dados.diasSelecionados" />
    </section>
</template>

<script setup lang="ts">
    import DiasFuncionamento from '../configuracoes/informacoesDoCardapio/DiasFuncionamento.vue';

    const dados = defineModel<{diasSelecionados: string[]}>({required: true});
    
</script>