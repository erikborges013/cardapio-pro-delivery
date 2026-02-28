<template>
  <section class="cadastrar_produto">
    <form class="form_produto" @submit.prevent="cadastrarOuEditar">
      <label for="imagem">
        <img :src="imagemPrevia ?? defaultImage" alt="imagem do produto" class="adicionar-imagem" />
      </label>
      <input type="file" @change="exibirImagem" id="imagem" accept="image/*" class="input-adicionar-imagem" />
      <BaseInput :tipo="'text'" :texto-place-holder="'Nome do produto'" :obrigatorio="true" v-model="nome"
        :quantidade="30" />
      <BaseInput :tipo="'text'" :texto-place-holder="'Ingredientes'" :obrigatorio="true" v-model="ingredientes" />
      <BaseInput :tipo="'text'" :texto-place-holder="'Peso (ex: 250g)'" :obrigatorio="false" v-model="peso" />
      <select id="produto-categoria" class="selecionar-categoria" v-model="categoriaId">
        <option value="" disabled>Selecione a categoria</option>
        <option v-for="categoria in categoriasDados.categorias" :key="categoria.dados.nome" :value="categoria.id">{{
          categoria.dados.nome }}</option>
      </select>
      <BaseInput :tipo="'number'" step="0.01" :texto-place-holder="'Preço do produto'" :obrigatorio="true"
        v-model="preco" />
      <a @click="mostrarTelaAdicionais" class="btn-adicionais" id="abrir-adicionais">Selecionar adicionais</a>
      <div class="adicionais-selecionados"><button type="button" v-for="adicional in adicionais">{{ adicional.nome
      }}</button></div>
      <section class="section_botoes" >
        <BaseButtonGenerico :texto="feedbackSalvando" :tipo="'submit'" :botaoEstaAtivo="statusBotao" />
        <BaseButtonGenerico :texto="'Cancelar'" :tipo="'button'" @click="voltarParaLista" />
      </section>
    </form>
    <CardEscolherAdicionais v-show="telaAdicionaisAtiva" @fecharCard="fecharTelaAdicionais"
      @confirmarAdicionais="adicionaisRecebidos" :adicionaisSelecionados="produtoEmEdicao?.adicionais" />

  </section>

</template>

<script setup lang="ts">
import { onBeforeMount, ref, watchEffect } from 'vue';
import { comprimirImagem } from '../../utils/comprimirImagem';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';
import BaseButtonGenerico from '../../components/ui/BaseButtonGenerico.vue';
import BaseInput from '../../components/ui/BaseInput.vue';
import { useCategoriaStore } from '../../stores/listaDeCategoriasStore';
import { useAdicionaisStore } from '../../stores/listaDeAdicionaisStore';
import CardEscolherAdicionais from './CardEscolherAdicionais.vue';
import IAdicionais from '../../interfaces/IAdicionais';
import converterParaNumber from '../../utils/normalizarPreco';
import { listaDeProdutos } from '../../stores/listaDeProdutosStore';
import useProduto from '../../composables/useProduto';
import defaultImage from '../../../assets/adicionarImagem.png';

const router = useRouter();

const { cadastrar, editar, limparStatus } = useProduto();

const imagemPrevia = ref<any>(null);
const userId = useAuthStore().uid;
const imagem = ref<File>()
const nome = ref<string>();
const ingredientes = ref<string>();
const peso = ref<string>();
const categoriaId = ref<string>("");
const preco = ref<number | string>();
const telaAdicionaisAtiva = ref<boolean>(false);
const adicionais = ref<IAdicionais[]>();
const statusBotao = ref<boolean>(false);
const feedbackSalvando = ref<string>('Salvar');

watchEffect(() => {
  console.log("ImagemPrevia", imagemPrevia.value);
  console.log("imagem normal", imagem.value)
})
const adicionaisDados = useAdicionaisStore();
const categoriasDados = useCategoriaStore();
onBeforeMount(() => {
  if (!userId) {
    console.log("uid não encontrado");
    return;
  }
  categoriasDados.puxarCategorias(userId);
  adicionaisDados.puxarAdicionais(userId);
})
const produtosStore = listaDeProdutos();
const produtoEmEdicao = produtosStore.produtoEmEdicao;


if (produtoEmEdicao !== null) {
  imagemPrevia.value = produtoEmEdicao.imagemURL;
  nome.value = produtoEmEdicao.nome;
  ingredientes.value = produtoEmEdicao.ingredientes;
  peso.value = produtoEmEdicao.peso;
  categoriaId.value = produtoEmEdicao.categoriaId;
  preco.value = produtoEmEdicao.preco;
  adicionais.value = produtoEmEdicao.adicionais;
}



function montarDados() {
  return {
    nome: nome.value,
    ingredientes: ingredientes.value,
    peso: peso.value,
    categoriaId: categoriaId.value,
    preco: converterParaNumber(preco.value),
    adicionais: adicionais.value || [],
  }
}


const exibirImagem = async (evento: Event) => {
  const input = evento.target as HTMLInputElement;
  if (!input.files?.length) return;
  imagem.value = await comprimirImagem(input.files![0]);
  if (imagem.value) {
    imagemPrevia.value = URL.createObjectURL(imagem.value);
  }
}

function voltarParaLista() {
  limparStatus();
  router.push("/produtos");
}

function adicionaisRecebidos(e: IAdicionais[]) {
  adicionais.value = e;

  telaAdicionaisAtiva.value = false;
}


function mostrarTelaAdicionais() {
  telaAdicionaisAtiva.value = true;
}

function fecharTelaAdicionais() {
  telaAdicionaisAtiva.value = false;
}

async function cadastrarOuEditar() {
  const dados = montarDados();
  const { adicionais, ...obrigatorios } = dados;
  const dadosPreenchidos = Object.values(obrigatorios).every(valor => !!valor);
  if (!dadosPreenchidos) {
    alert("Por favor preencha todos os dados corretamente");
    return false;
  }
  if (produtoEmEdicao !== null) {
    feedbackSalvando.value = "Atualizando...";
    statusBotao.value = true;
    const resultado = await editar(userId!, produtoEmEdicao.id, dados, imagem.value);
    resultado ? alert("Produto atualizado com sucesso!") : alert("Erro ao atualizar produto");
    router.push("/produtos");
  } else {
    statusBotao.value = true;
    feedbackSalvando.value = "Salvando...";
    const resultado = await cadastrar(dados, userId!, imagem.value);
    resultado ? alert("Produto cadastrado com sucesso!") : alert("Erro ao cadastrar produto");
    router.push("/produtos");
  }
  return true;
}

defineExpose({
  cadastrarOuEditar
});

</script>

<style lang="scss" scoped>
@reference "../../assets/tailwind.css";

.cadastrar_produto {
  @apply box-border flex flex-col w-full min-h-screen h-full pt-8 gap-4 items-center;
}

.form_produto {
  @apply flex flex-col items-center max-w-[70%] pb-5.5;
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