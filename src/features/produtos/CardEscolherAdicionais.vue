<template>
    <section class="sessao_adicionais">
        <div class="container_titulo">
            <h1>Adicionais</h1>
        </div>
        <div class="container_adicionais">

            <BaseCheckBox v-for="adicional in listaDeAdicionais.listaAdicionais" :key="adicional.id"
                :texto="adicional.nome" :value="adicional.id" v-model="idAdicionaisSelecionados" />

        </div>
        <div class="container_botoes">
            <base-button-generico :texto="'Escolher'" @click="confirmar" />
            <base-button-generico :texto="'Cancelar'" @click="$emit('fecharCard')" />
        </div>
    </section>
</template>

<script setup lang="ts">
import BaseCheckBox from '../../components/ui/BaseCheckBox.vue';
import BaseButtonGenerico from '../../components/ui/BaseButtonGenerico.vue';
import { useAdicionaisStore } from '../../stores/listaDeAdicionaisStore';
import { computed, ref, watch } from 'vue';
import IAdicionais from '../../interfaces/IAdicionais';
import { listaDeProdutos } from '../../stores/listaDeProdutosStore';

const idAdicionaisSelecionados = ref<string[]>([]);
const listaDeAdicionais = useAdicionaisStore();
const produtosStore = listaDeProdutos();
const produtoEmEdicao = produtosStore.produtoEmEdicao;

const props = defineProps<{
  adicionaisSelecionados?: IAdicionais[]
}>()

if (produtoEmEdicao !== null) {
    idAdicionaisSelecionados.value = props.adicionaisSelecionados?.map(adicional => adicional.id) || [];
    
}

const emits = defineEmits<{
    (e: 'fecharCard'): void,
    (e: 'confirmarAdicionais', 
        adicionais: IAdicionais[]
    ): void
}>();

const adicionaisCompletos = computed(() => {
    return idAdicionaisSelecionados.value
        .map(id => listaDeAdicionais.listaAdicionais.find(adicional => adicional.id === id))
        .filter((item): item is IAdicionais => item !== undefined);
});

const confirmar = () => {
    emits('confirmarAdicionais', 
        adicionaisCompletos.value || []
    );
    
}




</script>

<style scoped>
.sessao_adicionais {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1000;
    position: fixed;
    top: 0;

    background: linear-gradient(145deg, #2c2c2c, #3a3a3a);
    border-radius: 16px;
    color: var(--cor-principal-fonte);
    height: 100vh;
    right: 0;
    max-height: 100%;
    width: 30%;
    overflow-y: auto;
    overflow-x: hidden;
    max-width: 30%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 87, 34, 0.4);
}

.container_adicionais {
    padding: 1.5rem 0 3rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.container_titulo {
    position: sticky;
    top: 0;
    background: linear-gradient(145deg, #2c2c2c, #3a3a3a);
    padding: 1rem 0;
    width: 100%;
    font-family: var(--fonte-principal);
    text-align: center;
    z-index: 1001;
}

.container_botoes {
    display: flex;
    justify-content: center;
    gap: 1rem;
    position: sticky;
    bottom: 0;
    background: linear-gradient(145deg, #2c2c2c, #3a3a3a);
    padding: 1rem 0;
    width: 100%;
}

@media screen and (max-width: 769px) {
    .sessao_adicionais {
        width: 100%;
        max-width: 100%;
    }
}
</style>
