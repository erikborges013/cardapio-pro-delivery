<template>
    <section class="flex flex-col gap-4 pt-20 w-[90%]">
        <h1 class="text-center">Digite o WhatsApp do seu estabelecimento</h1>
        <baseInput :texto-place-holder="'Exemplo: 81912345678'" :widthPequeno="true" :tipo="'text'" :obrigatorio="true"
            v-model="celular" :quantidade="11" />
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import baseInput from '../../components/ui/BaseInput.vue';

const dados = defineModel<{ ddd: string, celular: string }>({ required: true });

const celular = computed({
    get() {
        return (dados.value.ddd || '') + (dados.value.celular || '');
    },
    set(novoValor: string) {
        dados.value.ddd = novoValor.slice(0, 2);
        dados.value.celular = novoValor.slice(2);
    }
});

</script>