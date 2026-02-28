<template>
    <section class="flex flex-col gap-4 pt-10 w-[90%]">
        <h1 class="text-center pb-20">Cadastre uma taxa de entrega</h1>
        <BaseInput :tipo="'text'" :textoPlaceHolder="'Nome do bairro'" :quantidade="30" :obrigatorio="true"
            v-model="taxaDeEntrega.nome" />
        <BaseInput :tipo="'number'" :textoPlaceHolder="'Valor da entrega ex: 10,00'" :quantidade="10" step="0.01"
            :obrigatorio="true" v-model="taxaDeEntrega.taxa" />
    </section>
</template>

<script setup lang="ts">
import BaseInput from '../../components/ui/BaseInput.vue';

const taxaDeEntrega = defineModel<{ nome: string, taxa: number }>('taxaDeEntrega',{ required: true });

</script>