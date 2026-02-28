<template>
    <section class="flex flex-col gap-1 pt-10 w-[90%]">
        <h1 class="text-center">Digite o endereço do seu estabelecimento</h1>
        <p>Cidade:</p>
        <baseInput :texto-place-holder="'Exemplo: Maragogi'" :widthPequeno="true" :tipo="'text'" :obrigatorio="true"
            v-model="dados.cidade" />
        <p>Bairro:</p>
        <baseInput :texto-place-holder="'Exemplo: Centro'" :widthPequeno="true" :tipo="'text'" :obrigatorio="true"
            v-model="dados.bairro" />
        <p>Rua</p>
        <baseInput :texto-place-holder="'Exemplo: Rua da praia'" :widthPequeno="true" :tipo="'text'" :obrigatorio="true"
            v-model="dados.rua" />
        <p>Nº</p>
        <baseInput :texto-place-holder="'Exemplo: 250'" :widthPequeno="true" :tipo="'text'" :obrigatorio="true"
            v-model="dados.numeroEstabelecimento" />
    </section>
</template>

<script setup lang="ts">
import baseInput from '../../components/ui/BaseInput.vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
    const dados = defineModel<{cidade: string, bairro: string, rua: string, numeroEstabelecimento: string}>({required: true})
</script>