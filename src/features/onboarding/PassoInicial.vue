<template>
    <section class="flex flex-col items-center pt-10 px-5 max-w-full">
        <h1 class="text-center">Quase lá! Vamos colocar sua loja no mapa?</h1>
        <p class="font-bebas text-center pt-10 pb-5 text-2xl">Em menos de 2 minutos, vou te ajudar a criar um cardápio
            profissional para você parar de anotar pedidos no papel e começar a vender mais.</p>
        <DotLottieVue src="/animations/tela-inicial.json" autoplay loop
            class="w-120 " />
    </section>
</template>

<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const dados = defineModel();
</script>