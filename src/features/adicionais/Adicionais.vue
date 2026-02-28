<template>
    <section class="sessao_adicionais">
        <img class="icone-voltar" @click="voltar" :src="setaVoltar" alt="setaVoltar">
        <h1>Adicionais</h1>
        <section v-if="storeAdicionais.listaAdicionais.length === 0">
            <BaseFeedbackSemItens :texto="'Nenhum adicional encontrado'" />
        </section>
        <section v-else-if="storeAdicionais.listaAdicionais.length > 0" class="adicionais_cadastradas">
            <ListarAdicionais />
        </section>
        <BaseButaoFlutuante @abrirFormulario="exibirTelaCadastro" :texto="'Novo adicional'" />
    </section>
</template>

<script setup lang="ts">
import setaVoltar from "../../../assets/voltar.png";
import { useRouter } from "vue-router";
import BaseFeedbackSemItens from "../../components/ui/BaseFeedbackSemItens.vue";
import BaseButaoFlutuante from "../../components/ui/BaseButaoFlutuante.vue";
import { useAdicionaisStore } from "../../stores/listaDeAdicionaisStore";
import ListarAdicionais from "./ListarAdicionais.vue";
import { onBeforeMount } from "vue";
import { useAuthStore } from "../../stores/authStore";
const router = useRouter();
const uid = useAuthStore().uid;
const storeAdicionais = useAdicionaisStore();

onBeforeMount(() => {
    if (!uid) {
        console.log("Uid não encontrado!");
        return;
    }
    storeAdicionais.puxarAdicionais(uid);
})

function exibirTelaCadastro() {
    router.push("/cadastraradicionais");
}

function voltar() {
    router.push("/admin");
}
</script>

<style lang="scss" scoped>
.sessao_adicionais {
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