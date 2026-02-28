<template>
  <section class="sessao-painel-administrativo">
    <div v-if="uid">
      <header>
        <p v-if="testeGratisAtivo" class="texto-teste-gratis">{{ textoTesteGratis }}</p>
        <p v-else-if="planoEmDia" class="texto-teste-gratis">Plano confirmado! Continue usando sem interrupções.</p>
        <p v-else class="texto-cardapio-desativado">Cardápio pausado. Assine um plano.</p>
      </header>
      <main>
        <section class="sessao-link-do-cardapio">
          <LinkCardapio />
        </section>
        <section class="opcoes__admin" id="opcoes__admin">
          <Cards v-for="card in cardsFiltrados" :key="card.pagina || 'paginaAssinatura'" :pagina="card.pagina"
            :caminho-icone="card.caminhoIcone" :texto="card.texto" :ehBotaoSair="card.ehBotaoSair"
            :ehBotaoAssinar="card.ehBotaoAssinar" @configActive="showConfigOptions" />
        </section>
        <section class="options-config" v-if="ehBotaoConfig === true">
          <Configuracoes @fecharConfig="showConfigOptions" />
        </section>
      </main>
    </div>
    <div v-else>
      <BasePreload />
    </div>
    <ButtonWhatsapp />
  </section>
</template>

<script setup lang="ts">
import { auth } from "../../firebase-config";
import { useValidarAcesso } from "../../servicos/useValidacaoUsuarioStripe";
import { computed, onBeforeMount, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
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
import { testeGratisAtivoStore } from "../../stores/testeAtivoStore";
import ButtonWhatsapp from "../../components/ui/ButtonWhatsapp.vue";
import Configuracoes from "../configuracoes/Configuracoes.vue";
import { Unsubscribe } from "firebase/auth";

const router = useRouter();
const ehBotaoConfig = ref<boolean>(false);
const uid = computed(() => useAuthStore().uid);
const planoEmDia = ref(false);
const usuarioEstaAtivoStore = testeGratisAtivoStore();



const testeGratisAtivo = computed(
  () => usuarioEstaAtivoStore.usuarioEmTeste
);
const textoTesteGratis = computed(
  () => usuarioEstaAtivoStore.quantidadeDeDiasGratis
);

function showConfigOptions() {
  ehBotaoConfig.value = !ehBotaoConfig.value;
  console.log(ehBotaoConfig.value);
}

let cards = ref<Card[]>([
  {
    pagina: "produtos",
    caminhoIcone: iconeProdutos,
    texto: "Produtos",
  },
  {
    pagina: "Categorias",
    caminhoIcone: iconeCategorias,
    texto: "Categorias",
  },
  {
    pagina: "Adicionais",
    caminhoIcone: iconeAdicionais,
    texto: "Adicionais",
  },
  {
    pagina: "Configuracoes",
    caminhoIcone: iconeConfiguracoes,
    texto: "Configuracoes",
  },
  {
    pagina: "",
    caminhoIcone: iconePagar,
    texto: "",
    ehBotaoAssinar: true,
  },
  {
    pagina: "Login",
    caminhoIcone: iconeSair,
    texto: "Sair",
    ehBotaoSair: true,
  },
]);

const cardsFiltrados = computed(() => {
  return testeGratisAtivo.value ? cards.value.filter((card) => card.ehBotaoAssinar !== true) : cards.value;
});
onBeforeMount(() => {
  if (!uid.value) {
    console.log("Uid do usuário não encontrado!");
    return;
  }
});
let unsubscribeAuth: Unsubscribe;
onMounted(() => {
  unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
    if (!uid.value) {
      console.log("uid não encontrado");
      return;
    }
    if (!user) {
      console.log("Usuário não encontrado");
      router.push("Login");
    }
    if (user) {
      const { statusAcesso, assinaturaAtiva } = useValidarAcesso(user);
      const cardAssinatura = cards.value.find((c) => c.ehBotaoAssinar);
  
      planoEmDia.value = !!(await statusAcesso());
      textoAssinatura();
      watch(assinaturaAtiva, (novoValor) => {
        planoEmDia.value = novoValor;
        textoAssinatura();
      });
  
      function textoAssinatura() {
        if (cardAssinatura) {
          cardAssinatura.texto = planoEmDia.value ? "Gerenciar plano" : "Assinar agora";
        }
      }
      console.log("O uid definido pelo pinia é:", uid);
  
      sessionStorage.setItem("usuario", uid.value);
    }
  });
});

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth();
})
</script>

<style scoped>
main {
  padding-top: 3rem;
}

.sessao-painel-administrativo {
  padding: 2rem 0;
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
    padding-top: 5rem;
  }
}
</style>
