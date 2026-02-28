<template>
    <section class="sessao_produtos">
        <img class="icone-voltar" @click="voltar" :src="setaVoltar" alt="setaVoltar">
        <h1>Produtos</h1>
        <section v-if="storeProdutos.produtos.length === 0">
            <BaseFeedbackSemItens :texto="'Nenhum produto encontrado'" />
        </section>
        <section v-else-if="storeProdutos.produtos.length > 0" class="lanches__cadastrados">
            <ListarProdutos />
        </section>
        <BaseButaoFlutuante @abrirFormulario="exibirTelaCadastro" :texto="'Novo produto'" />
    </section>
</template>

<script setup lang="ts">
import ListarProdutos from './ListarProdutos.vue';
import BaseFeedbackSemItens from '../../components/ui/BaseFeedbackSemItens.vue';
import { listaDeProdutos } from '../../stores/listaDeProdutosStore';
import { onMounted, ref, watch } from 'vue';
import BaseButaoFlutuante from '../../components/ui/BaseButaoFlutuante.vue';
import { useRouter } from 'vue-router';
import setaVoltar from "../../../assets/voltar.png";
const router = useRouter();

const storeProdutos = listaDeProdutos();


function exibirTelaCadastro() {
    router.push("/cadastrarproduto");
}

function voltar() {
    router.push("/admin");
}


onMounted(() => {
    storeProdutos.buscarProdutos();
})
</script>

<style scoped>
.sessao_produtos {
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