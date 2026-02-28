<template>
    <section class="sessao-formas-de-pagamento">
        <form class="form-cadastro-informacoes">
            <p>Selecione as formas de pagamento:</p>
            <BaseCheckBox v-for="forma in formasDePagamento" :texto="forma" :value="forma"
                v-model="formasSelecionadas" />
            <br>
            
        </form>
    </section>
</template>

<script setup lang="ts">
import BaseCheckBox from '../../../components/ui/BaseCheckBox.vue';
import { formasDePagamentoStore } from '../../../stores/formasDePagamentoStore';
import { onBeforeMount, ref, toRaw, watch } from 'vue';
import { useAuthStore } from '../../../stores/authStore';
const uid = useAuthStore().uid;
const formasDePagamento = ["Pix", "Dinheiro", "Cartão de débito", "Cartão de crédito"];
const formasDePagamentoSelecionados = formasDePagamentoStore();
const formasSelecionadas = defineModel<string[]>('formasDePagamento',{ required: true });


onBeforeMount(() => {
    if (!uid) {
        console.log("Uid não encontrado!");
        return;
    }
    formasDePagamentoSelecionados.puxarFormasDePagamento(uid);
})

watch(
    () => formasDePagamentoSelecionados.formasDePagamento,
    (selecionados) => {
        formasSelecionadas.value = selecionados ?? [];
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
@reference "../../../assets/tailwind.css";

.sessao-formas-de-pagamento {
    @apply flex flex-col h-full w-full font-bebas items-center;
}

.form-cadastro-informacoes {
    @apply w-80 lg:w-200;
}
</style>