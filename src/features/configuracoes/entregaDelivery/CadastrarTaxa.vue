<template>
  <section class="sessao_cadasstrar-taxa">
    <h1>Cadastrar taxa</h1>
    <section class="formulario_taxa-entrega">
      <form class="form_taxa" @submit.prevent="cadastrarOuEditar">
        <BaseInput :tipo="'text'" :texto-place-holder="'Nome do bairro'" :obrigatorio="true" v-model="nome"
          :quantidade="30" />
        <BaseInput :tipo="'number'" step="0.01" :texto-place-holder="'Preço (ex: 5,00)'" :obrigatorio="false"
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
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../../../stores/authStore';
import { useRouter } from 'vue-router';
import BaseButtonGenerico from '../../../components/ui/BaseButtonGenerico.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import useTaxasDeEntrega from '../../../composables/useTaxasDeEntrega';
import { useTaxasDeEntregaStore } from '../../../stores/taxasDeEntregaStore';

const router = useRouter();

const userId = useAuthStore().uid;
const nome = ref<string>();
const ordem = ref<number>();
const statusBotao = ref<boolean>(false);
const feedbackSalvando = ref<string>('Salvar');
const { cadastrar, editar, limparStatus } = useTaxasDeEntrega(userId!);

const taxaStore = useTaxasDeEntregaStore();
const taxaEmEdicao = taxaStore.taxaEmEdicao;

if (taxaEmEdicao !== null) {
  nome.value = taxaEmEdicao.nome
  ordem.value = taxaEmEdicao.taxa;
  console.log(taxaEmEdicao);
}

function montarDados() {
  return {
    nome: nome.value!,
    taxa: ordem.value!,
  }
}

function voltarParaLista() {
  limparStatus();
  router.push("/taxasdeentrega");
}


async function cadastrarOuEditar() {
  const dados = montarDados();
  if (!dados.nome || dados.taxa < 0 || (!dados.taxa && dados.taxa !== 0)) {
    alert("Por favor, preencha os dados corretamente");
    return false;
  }
  if (taxaEmEdicao?.id !== null && taxaEmEdicao?.id !== undefined && taxaEmEdicao !== null) {
    feedbackSalvando.value = "Atualizando...";
    statusBotao.value = true;
    await editar(dados, taxaEmEdicao.id);
    limparStatus();
    router.push("/taxasdeentrega");
  } else {
    statusBotao.value = true;
    feedbackSalvando.value = "Salvando...";
    const result = await cadastrar(dados);
    if (result) {
      alert("Taxa cadastrada com sucesso!");
      router.push("/taxasdeentrega");
    } else {
      alert("Falha ao cadastrar taxa de entrega");
    }
  }
  return true;
}

</script>

<style lang="scss" scoped>
@reference "../../../assets/tailwind.css";

.sessao_cadasstrar-taxa {
  @apply flex flex-col items-center pt-10
}

.formulario_taxa-entrega {
  @apply flex flex-col items-center justify-center min-h-96 gap-4;
}

.form_taxa {
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