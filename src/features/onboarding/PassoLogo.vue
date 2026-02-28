<template>
    <section class="flex flex-col items-center gap-15 pt-20 w-[90%]">
        <h1 class="text-center">Adicione a logo do seu estabelecimento.</h1>
        <CardapioImagemUpload v-model:imagem-previa-url="dados.imagemPrevia" v-model:imagem-arquivo="dados.imagem" />
    </section>
</template>

<script setup lang="ts">
import CardapioImagemUpload from '../configuracoes/informacoesDoCardapio/CardapioImagemUpload.vue';

const dados = defineModel<{ imagemPrevia: string, imagem: File | undefined }>({ required: true });

</script>
