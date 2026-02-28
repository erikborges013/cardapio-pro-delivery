<template>
    <div class="container__tempo-de-entrega">
        <label>Tempo estimado para entrega:</label>
        <div class="container-opcoes">
            <select class="opcoes" v-model="dados.horaEstimadaEntrega">
                <option disabled value="">Selecione</option>
                <option value="0">0h</option>
                <option value="1">1h</option>
                <option value="2">2h</option>
            </select>
            <select class="opcoes" v-model="dados.minutosEstimadoEntrega">
                <option disabled value="">Selecione</option>
                <option value="0">00min</option>
                <option value="15">15min</option>
                <option value="30">30min</option>
                <option value="45">45min</option>
            </select>
        </div>
        <label>Tempo estimado para retirada:</label>
        <div class="container-opcoes">
            <select class="opcoes" v-model="dados.horaEstimadaRetirada">
                <option disabled value="">Selecione</option>
                <option value="0">0h</option>
                <option value="1">1h</option>
                <option value="2">2h</option>
            </select>
            <select class="opcoes" v-model="dados.minutosEstimadoRetirada">
                <option disabled value="">Selecione</option>
                <option value="0">00min</option>
                <option value="15">15min</option>
                <option value="30">30min</option>
                <option value="45">45min</option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">

const dados = defineModel<any>('dados', { required: true });

</script>

<style lang="scss" scoped>
@reference "../../../assets/tailwind.css";

.container__tempo-de-entrega {
    @apply grid grid-cols-2 gap-4 justify-center items-center w-full pb-4;
}

.container-opcoes {
    @apply flex flex-col;
}

.opcoes {
    @apply bg-white text-black border rounded p-2
}
</style>