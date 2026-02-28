<template>
    <section class="flex flex-col items-center gap-4 pt-20 w-[90%]">
            <h1 class="text-center">Digite o nome do seu estabelecimento</h1>
            <baseInput :texto-place-holder="'Exemplo: Açaí do zé'" :widthPequeno="true" :tipo="'text'"
                :obrigatorio="true" v-model="dados.nomeEstabelecimento" />
        </section>
</template>

<script setup lang="ts">
import BaseInput from '../../components/ui/BaseInput.vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const dados = defineModel<{nomeEstabelecimento: string,}>({ required: true });

</script>