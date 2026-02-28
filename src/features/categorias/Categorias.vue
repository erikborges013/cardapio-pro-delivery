<template>
    <section class="sessao_categorias">
        <img class="icone-voltar" @click="voltar" :src="setaVoltar" alt="setaVoltar">
        <h1>Categorias</h1>
        <section v-if="categorias.length === 0">
            <BaseFeedbackSemItens :texto="'Nenhuma categoria encontrada'" />
        </section>
        <section v-else-if="categorias.length > 0" class="categorias_cadastradas">
            <ListarCategorias />
        </section>
        <BaseButaoFlutuante @abrirFormulario="exibirTelaCadastro" :texto="'Novo categoria'" />
    </section>
</template>

<script setup lang="ts">
import setaVoltar from "../../../assets/voltar.png";
import { useRouter } from "vue-router";
import { useCategoriaStore } from "../../stores/listaDeCategoriasStore";
import BaseFeedbackSemItens from "../../components/ui/BaseFeedbackSemItens.vue";
import BaseButaoFlutuante from "../../components/ui/BaseButaoFlutuante.vue";
import ListarCategorias from "./ListarCategorias.vue";
import { computed, onBeforeMount, onMounted } from "vue";
import { useAuthStore } from "../../stores/authStore";
const router = useRouter();
const uid = useAuthStore().uid;

const storeCategorias = useCategoriaStore();
onBeforeMount(() => {
    if (!uid) {
        alert("Usuário não encontrado!");
        return;
    }
    storeCategorias.puxarCategorias(uid);
})

const categorias = computed(() => {
    return storeCategorias.categorias || [];
})


function exibirTelaCadastro() {
    router.push("/cadastrarcategorias");
}

function voltar() {
    router.push("/admin");
}
</script>

<style lang="scss" scoped>
.sessao_categorias {
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