<template>
    <section class="sessao-titulo">
        <img class="icone-voltar" @click="voltar" :src="setaVoltar" alt="setaVoltar">
        <h1 class="titulo_pagina">{{ texto }}</h1>
    </section>
</template>

<script setup lang="ts">
import setaVoltar from "../../../assets/voltar.png";
import { useRouter } from "vue-router";

const props = defineProps<{
    texto: string
    caminhoVoltar: string
}>();

const router = useRouter();
function voltar() {
    router.push(`/${props.caminhoVoltar}`);
}
</script>

<style lang="scss" scoped>
@reference "../../assets/tailwind.css";

.sessao-titulo {
    @apply pb-10
}

.icone-voltar {
    @apply w-7 absolute top-5 left-4 cursor-pointer;
}

.titulo_pagina {
    @apply text-center pt-4 pb-4 text-3xl;
}
</style>