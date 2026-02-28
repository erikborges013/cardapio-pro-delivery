<template>
    <p class="pb-5">Dias de funcionamento:</p>
    <div class="container-dia-funcionamento" v-for="dia in diasDaSemana">
        <label class="switch">
            <input type="checkbox" :value="dia" v-model="diasSelecionados" />
            <span class="slider"></span>
        </label>
        <div class="dia-funcionamento">
            <p>{{ dia }}</p>
        </div>
    </div>

</template>

<script setup lang="ts">
const diasDaSemana = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
]

const diasSelecionados = defineModel("diasSelecionados", {required: true});

</script>

<style lang="scss" scoped>
@reference "../../../assets/tailwind.css";

.container-dia-funcionamento {
    @apply flex items-center justify-between w-full h-10 border border-[#ffffff7a];
}

.dia-funcionamento {
    @apply absolute left-1/2 -translate-x-1/2;
}


</style>