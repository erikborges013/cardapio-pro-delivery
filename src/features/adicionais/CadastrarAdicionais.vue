<template>
  <section class="section_cadastrar-categoria">
    <h1>Cadastrar adicional</h1>
    <section class="formulario_categoria">
      <form class="form_produto" @submit.prevent="cadastrarOuEditar">
        <BaseInput :tipo="'text'" :texto-place-holder="'Nome do adicional'" :obrigatorio="true" v-model="nome"
          :quantidade="30" />
        <BaseInput :tipo="'number'" step="0.01" :texto-place-holder="'Preço(ex: 10,00)'" :obrigatorio="false"
          v-model="preco" />

        <section class="section_botoes">
          <BaseButtonGenerico :texto="feedbackSalvando" :tipo="'submit'" :botaoEstaAtivo="statusBotao" />
          <BaseButtonGenerico :texto="'Cancelar'" :tipo="'button'" @click="voltarParaLista" />
        </section>
      </form>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';
import BaseButtonGenerico from '../../components/ui/BaseButtonGenerico.vue';
import BaseInput from '../../components/ui/BaseInput.vue';
import { useAdicionaisStore } from '../../stores/listaDeAdicionaisStore';
import useAdicionais from '../../composables/useAdicionais';

const router = useRouter();

const userId = useAuthStore().uid;
const nome = ref<string>();
const preco = ref<number>();
const statusBotao = ref<boolean>(false);
const feedbackSalvando = ref<string>('Salvar');
const { editar, cadastrar, limparStatus } = useAdicionais(userId!);

const adicionalStore = useAdicionaisStore();
const adicionalEmEdicao = adicionalStore.adicionalEmEdicao;

if (adicionalEmEdicao !== null) {
  nome.value = adicionalEmEdicao.nome;
  preco.value = adicionalEmEdicao.preco
  console.log(adicionalEmEdicao);
}

function montarDados() {
  return {
    nome: nome.value!,
    preco: preco.value!,
  }
}

function voltarParaLista() {
  limparStatus();
  router.push("/adicionais");
}


async function cadastrarOuEditar() {
  const dados = montarDados();
  if (adicionalEmEdicao !== null) {
    feedbackSalvando.value = "Atualizando...";
    statusBotao.value = true;
    await editar(dados, adicionalEmEdicao.id);
    alert("Adicional atualizado com sucesso!");
    limparStatus();
    router.push("/adicionais");
  } else {
    statusBotao.value = true;
    feedbackSalvando.value = "Salvando...";
    await cadastrar(dados);
    alert("adicional cadastrado com sucesso!");
    router.push("/adicionais");
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