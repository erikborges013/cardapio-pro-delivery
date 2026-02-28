<template>
  <section class="section_cadastrar-categoria">
    <h1>Cadastrar categoria</h1>
    <section class="formulario_categoria">
      <form class="form_produto" @submit.prevent="cadastrarOuEditar">
        <BaseInput :tipo="'text'" :texto-place-holder="'Nome do produto'" :obrigatorio="true" v-model="nome"
          :quantidade="30" />
        <BaseInput :tipo="'number'" :texto-place-holder="'Ordem da categoria (ex: 1)'" :obrigatorio="false"
          v-model="ordem" />

        <section class="section_botoes">
          <BaseButtonGenerico :texto="feedbackSalvando" :tipo="'submit'" :botaoEstaAtivo="statusBotao" />
          <BaseButtonGenerico :texto="'Cancelar'" :tipo="'button'" @click="voltarParaLista" />
        </section>
      </form>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { comprimirImagem } from '../../utils/comprimirImagem';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';
import BaseButtonGenerico from '../../components/ui/BaseButtonGenerico.vue';
import BaseInput from '../../components/ui/BaseInput.vue';
import { useCategoriaStore } from '../../stores/listaDeCategoriasStore';
import { useAdicionaisStore } from '../../stores/listaDeAdicionaisStore';
import IAdicionais from '../../interfaces/IAdicionais';
import converterParaNumber from '../../utils/normalizarPreco';
import { listaDeProdutos } from '../../stores/listaDeProdutosStore';
import useProduto from '../../composables/useProduto';
import useCategorias from '../../composables/useCategorias';

const router = useRouter();

const userId = useAuthStore().uid;
const nome = ref<string>();
const ordem = ref<number>();
const statusBotao = ref<boolean>(false);
const feedbackSalvando = ref<string>('Salvar');
const { cadastrar, editar, limparStatus } = useCategorias(userId!);

const categoriasStore = useCategoriaStore();
const categoriaEmEdicao = categoriasStore.categoriaEmEdicao;

if (categoriaEmEdicao !== null) {
  nome.value = categoriaEmEdicao.dados.nome
  ordem.value = categoriaEmEdicao.dados.ordem;
  console.log(categoriaEmEdicao.dados);
}

function montarDados() {
  return {
    nome: nome.value!,
    ordem: ordem.value!,
  }
}

function voltarParaLista() {
  limparStatus();
  router.push("/categorias");
}


async function cadastrarOuEditar() {
  const dados = montarDados();
  if (categoriaEmEdicao !== null) {
    feedbackSalvando.value = "Atualizando...";
    statusBotao.value = true;
    await editar(dados, categoriaEmEdicao.id);
    limparStatus();
    router.push("/categorias");
  } else {
    statusBotao.value = true;
    feedbackSalvando.value = "Salvando...";
    await cadastrar(dados);
    router.push("/categorias");
  }
}

</script>

<style lang="scss" scoped>
@reference "../../assets/tailwind.css";

.section_cadastrar-categoria {
  @apply flex flex-col items-center pt-10
}

.formulario_categoria {
  @apply flex flex-col items-center justify-center min-h-96 gap-4;
}

.form_produto {
  @apply flex flex-col items-center max-w-[70%] pb-5.5;

  /* Centralizar inputs */
  input,
  textarea,
  select,
  .base-input {
    @apply w-full max-w-md;
    /* largura fixa máxima para centralizar */
  }
}

.adicionar-imagem {
  @apply w-25 rounded-lg mb-4 cursor-pointer;
}

.input-adicionar-imagem {
  @apply pb-4 hidden;
  color: var(--cor-principal-fonte);
}

.selecionar-categoria {
  @apply p-3 mb-4 rounded-md border border-[#666] bg-[#2b2b2b] w-[80vw] max-w-full;
  color: var(--cor-principal-fonte);
}

.btn-adicionais {
  @apply w-[80vw] max-w-full box-border p-3 mb-4 rounded-md border border-[#666] bg-[#2b2b2b] transition-all duration-300 no-underline cursor-pointer;
  color: var(--cor-principal-fonte);
}

.section_botoes {
  @apply flex gap-4 fixed bottom-0 bg-[#41414100] w-full p-5 justify-between;
}

.adicionais-selecionados {
  @apply flex flex-wrap gap-4 justify-center pb-3.5;

  button {
    @apply px-2.5 rounded-md border-none cursor-pointer bg-[#cacaca] text-black;
  }
}

.botao__form {
  @apply w-40 p-2.5 rounded-md text-base font-normal cursor-pointer border-none;
  background-color: var(--cor-botao);
  font-family: var(--fonte-principal);
}
</style>