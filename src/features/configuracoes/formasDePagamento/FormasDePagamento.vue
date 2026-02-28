<template>
    <section class="sessao-formas-de-pagamento">
        <BaseTituloCabecalho :texto="'Informações do cardápio'" :caminhoVoltar="'admin'" />

        <CheckBoxPagamentos v-model:formasDePagamento="formasSelecionadas" />
        <span class="flex justify-center">
            <BaseButaoFlutuante texto="Salvar" @click="enviar()" />
        </span>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseTituloCabecalho from '../../../components/ui/BaseTituloCabecalho.vue';
import { useFormasDePagamento } from '../../../composables/useFormasDePagamento';
import { useAuthStore } from '../../../stores/authStore';
import CheckBoxPagamentos from './CheckBoxPagamentos.vue';
import { useRouter } from 'vue-router';
import BaseButaoFlutuante from '../../../components/ui/BaseButaoFlutuante.vue';
const uid = useAuthStore().uid;
const router = useRouter();
const formasSelecionadas = ref([]);



async function enviar(): Promise<boolean> {
    if (!uid) {
        console.error("Uid não encontrado");
        return false;
    }
    if (!formasSelecionadas.value) {
        alert("Selecione as formas de pagamento");
        return false;
    }
    const { enviarParaBancoDeDados } = useFormasDePagamento(uid);
    const resultado = await enviarParaBancoDeDados(formasSelecionadas.value);
    if (resultado) {
        alert("Formas de pagamentos cadastradas com sucesso!");
        router.push("/admin");
    } else {
        alert("Erro ao tentar enviar formas de pagamento para o banco de dados");
    }
    return true;
}

</script>

<style lang="scss" scoped>
@reference "../../../assets/tailwind.css";

.sessao-formas-de-pagamento {
    @apply pb-40;
}
</style>