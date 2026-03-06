<template>
  <section class="sessao-painel-administrativo">
    <div v-if="carregando">
      <BasePreload />
    </div>
    <div v-else>
      <header class="pt-10 md:pt-0">
        <h1 class="text-center">Seja bem vindo <br> {{ nomeEstabelecimento }}</h1>
      </header>
      <main>
        <section class="sessao-link-do-cardapio">
          <LinkCardapio />
        </section>
        <section class="opcoes__admin" id="opcoes__admin">
          <Cards v-for="card in cards" :key="card.texto" :pagina="card.pagina" :caminho-icone="card.caminhoIcone"
            :texto="card.texto" :ehBotaoSair="card.ehBotaoSair" :ehBotaoAssinar="card.ehBotaoAssinar"
            @configActive="abrirOuFecharConfig" />
        </section>
        <section class="options-config" v-if="ehBotaoConfig">
          <Configuracoes @fecharConfig="abrirOuFecharConfig" />
        </section>
      </main>
    </div>
    <ButtonWhatsapp />
  </section>
</template>

<script setup lang="ts">
import { useValidarAcesso } from "../../servicos/useValidacaoUsuarioStripe";
import { computed, ref, watch } from "vue";
import LinkCardapio from "./LinkCardapio.vue";
import Cards from "./Cards.vue";
import iconeProdutos from "../../../assets/adicionar-produto.png";
import iconeCategorias from "../../../assets/categoria.png";
import iconeAdicionais from "../../../assets/adicionar.png";
import iconeConfiguracoes from "../../../assets/config.svg";
import iconePagar from "../../../assets/pagar.png";
import iconeSair from "../../../assets/sair.png";
import { useAuthStore } from "../../stores/authStore";
import BasePreload from "../../components/ui/BasePreload.vue";
import ButtonWhatsapp from "../../components/ui/ButtonWhatsapp.vue";
import Configuracoes from "../configuracoes/Configuracoes.vue";
import { informacoesDoCardapioStore } from "../../stores/informacoesDoCardapioStore";

const ehBotaoConfig = ref<boolean>(false);
const informacoesDoCardapio = informacoesDoCardapioStore();
const authStore = useAuthStore();

const uid = computed(() => authStore.uid);
const carregando = ref(true);

const planoEmDia = ref(false);
const nomeEstabelecimento = computed(() => informacoesDoCardapio.informacoesDoEstabelecimento?.nomeDoEstabelecimento)

function abrirOuFecharConfig() {
  ehBotaoConfig.value = !ehBotaoConfig.value;
}

const textoBotaoAssinatura = computed(() => planoEmDia.value ? "Gerenciar plano" : "Assinar agora");
type Card = {
  pagina: string;
  caminhoIcone: string;
  texto: string;
  ehBotaoSair?: boolean;
  ehBotaoAssinar?: boolean;
};
const cards = computed<Card[]>(() => [
  { pagina: "produtos", caminhoIcone: iconeProdutos, texto: "Produtos", },
  { pagina: "Categorias", caminhoIcone: iconeCategorias, texto: "Categorias", },
  { pagina: "Adicionais", caminhoIcone: iconeAdicionais, texto: "Adicionais", },
  { pagina: "Configuracoes", caminhoIcone: iconeConfiguracoes, texto: "Configuracoes", },
  { pagina: "", caminhoIcone: iconePagar, texto: textoBotaoAssinatura.value, ehBotaoAssinar: true, },
  { pagina: "Login", caminhoIcone: iconeSair, texto: "Sair", ehBotaoSair: true, },
]);

let cancelarObservadorAssinatura: (() => void) | null = null;

async function carregarDados(uid: string): Promise<boolean> {
  const acesso = useValidarAcesso();
  if (!acesso) {
    return false;
  }
  try {
    await informacoesDoCardapio.puxarInfoDoEstabelecimento(uid);

    const { statusAcesso, assinaturaAtiva } = acesso;

    planoEmDia.value = !!(await statusAcesso());

    if (cancelarObservadorAssinatura) {
      cancelarObservadorAssinatura();
    }

    cancelarObservadorAssinatura = watch(assinaturaAtiva, (novoValor) => {
      planoEmDia.value = novoValor;
    });

  } catch (erro) {
    console.error("Falha critica ao carregar os dados do painel:", erro);
  }

  return false;
}

watch(uid, async (novoUid) => {
  if (novoUid) {
    carregando.value = await carregarDados(novoUid);
  } else {
    carregando.value = true;
  }
}, { immediate: true });
</script>

<style scoped>
main {
  padding-top: 0rem;
}

.sessao-painel-administrativo {
  padding: 0;
  color: var(--cor-principal-fonte);
  font-family: var(--fonte-principal);
  height: 100vh;
  box-sizing: border-box;
}

.sessao-link-do-cardapio {
  display: flex;
  flex-direction: column;
  align-items: center;
}

header h1 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 1em;
  padding-top: 14px;
  font-weight: 400;
}

.cards-painel-administrativo {
  display: flex;
  gap: 10px;
}

.opcoes__admin {
  display: flex;
  flex-wrap: wrap;
  padding: 0 5rem;
  margin-top: 2rem;
  gap: 1em;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
}

.container-card {
  width: 130px;
  background-color: rgba(155, 155, 155, 0.342);
  height: 130px;
}

.texto-teste-gratis {
  position: fixed;
  white-space: pre-line;
  top: 0;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  color: #000000;
  background-color: #ffffff;
  padding: 10px;
}

.texto-cardapio-desativado {
  position: fixed;
  top: 0;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  color: red;
  background-color: #ffffff;
  padding: 10px;
}

@media (max-width: 480px) {
  .opcoes__admin {
    padding: 0 2.5rem;
  }

  main {
    padding-top: 1rem;
  }
}
</style>
