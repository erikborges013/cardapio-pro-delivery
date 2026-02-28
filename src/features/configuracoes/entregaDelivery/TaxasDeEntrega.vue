<template>
    <section class="sessao_taxas">
        <img class="icone-voltar" @click="voltar" :src="setaVoltar" alt="setaVoltar">
        <h1>Taxas de entrega</h1>
        <section v-if="storeTaxasDeEntrega.taxas.length === 0">
            <BaseFeedbackSemItens :texto="'Nenhuma taxa encontrada'" />
        </section>
        <section v-else-if="storeTaxasDeEntrega.taxas.length > 0" class="taxas_cadastradas">
            <ListarTaxas />
        </section>
        <BaseButaoFlutuante @abrirFormulario="exibirTelaCadastro" :texto="'Nova taxa'" />
    </section>
</template>

<script setup lang="ts">
import setaVoltar from "../../../../assets/voltar.png";
import { useRouter } from "vue-router";
import BaseFeedbackSemItens from "../../../components/ui/BaseFeedbackSemItens.vue";
import BaseButaoFlutuante from "../../../components/ui/BaseButaoFlutuante.vue";
import { useTaxasDeEntregaStore } from "../../../stores/taxasDeEntregaStore";
import ListarTaxas from "./ListarTaxas.vue";
import { onBeforeMount } from "vue";
import { useAuthStore } from "../../../stores/authStore";
const router = useRouter();
const uid = useAuthStore().uid;
const storeTaxasDeEntrega = useTaxasDeEntregaStore();

onBeforeMount(() => {
    if (!uid) {
        console.log("Uid não encontrado!");
        return;
    }
    storeTaxasDeEntrega.buscarTaxas(uid);
})

function exibirTelaCadastro() {
    router.push("/cadastrarTaxa");
}

function voltar() {
    router.push("/admin");
}
</script>

<style lang="scss" scoped>
.sessao_taxas {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    font-family: var(--fonte-principal);
    padding: 1.5em;
    background: var(--background-color);
    color: var(--cor-principal-fonte);
    padding-bottom: 80px;
}

h1 {
    margin-bottom: 1em;
    font-weight: 400;
    font-size: 2em;
    text-align: center;
}

.icone-voltar {
    width: 40px;
    position: absolute;
    top: 18px;
    cursor: pointer;
}

</style>