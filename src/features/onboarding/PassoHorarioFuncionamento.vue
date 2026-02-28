<template>
    <section class="flex flex-col items-center gap-4 pt-10 w-[90%]">
        <h1 class="text-center md:pb-15" >Em qual horário você atende?</h1>
        <div class="flex flex-col justify-center  md:flex-row md:w-97 md:gap-40 gap-5">
            <HorarioDeFuncionamento :label="'Abre às'" :modelValue="dados.horaInicialFuncionamento" @update:model-value="definirHorarioInicial" />
            <HorarioDeFuncionamento :label="'Fecha às'" :modelValue="dados.horaFinalFuncionamento" @update:model-value="definirHorarioFinal" />
        </div>
    </section>
</template>

<script setup lang="ts">
import HorarioDeFuncionamento from '../configuracoes/informacoesDoCardapio/HorarioDeFuncionamento.vue';

const dados = defineModel<{horaInicialFuncionamento: string, horaFinalFuncionamento: string}>({required: true});

function definirHorarioInicial(horario: string) {
    dados.value.horaInicialFuncionamento = horario;
}

function definirHorarioFinal(horario: string) {
    dados.value.horaFinalFuncionamento = horario
}
</script>