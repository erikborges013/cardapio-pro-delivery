<template>
    <section class="flex flex-col gap-4 pt-10 w-[90%]">
        <h1 class="text-center">Quais formas de pagamento você aceita?</h1>
        <section class="sessao-formas-de-pagamento">
            <form class="form-cadastro-informacoes">
                <p>Selecione as formas de pagamento:</p>
                <BaseCheckBox v-for="forma in opcoesFormasDePagamento" :texto="forma" :value="forma"
                    v-model="formasDePagamentoSelecionadas" />
                <br>
            </form>
        </section>
    </section>
</template>

<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import BaseCheckBox from '../../components/ui/BaseCheckBox.vue';
const opcoesFormasDePagamento = ["Pix", "Dinheiro", "Cartão de débito", "Cartão de crédito"];

const formasDePagamentoSelecionadas = defineModel<string[]>('opcoesDePagamento', {required: true})

</script>

<style scoped lang="scss">
@reference "../../assets/tailwind.css";

.sessao-formas-de-pagamento {
    @apply flex flex-col h-full w-full font-bebas items-center;
}

.form-cadastro-informacoes {
    @apply w-80 lg:w-200;
}
</style>