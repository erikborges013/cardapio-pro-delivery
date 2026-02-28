<template>
  <button @click="irPara" class="opcoes__botao" :disabled="carregando" :class="botaoDesabilitado">
    <img :src="caminhoIcone" alt="icone-produtos" class="icone" />{{ textoBotaoPlano !== "" ? textoBotaoPlano : texto }}
  </button>
</template>

<script setup lang="ts">
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";
import { db, auth } from "../../firebase-config";
import { signOut } from "firebase/auth";
import { ref } from "vue";
import { configStripe } from "../../servicos/stripe";
import { useAuthStore } from "../../stores/authStore";
import { destruirStores } from "../../utils/destruir";

const router = useRouter();

const textoBotaoPlano = ref("");
const carregando = ref(false);
const botaoDesabilitado = ref("");
const emit = defineEmits(["configActive"]);

const props = defineProps({
  pagina: { type: String, required: true },
  caminhoIcone: { type: String, required: true },
  texto: { type: String, required: true },
  ehBotaoSair: { type: Boolean },
  ehBotaoAssinar: { type: Boolean },
});

async function irPara() {
  const uid = useAuthStore().uid;
  console.log("Uid dos cards:", uid);
  if (!uid) {
    console.error("Erro de autenticação, faça login novamente.");
    router.push("Login");
    return;
  }
  if (props.pagina === "Produtos") {
    try {
      const categoriaRef = collection(db, "usuarios", uid, "categorias");
      const categorias = await getDocs(categoriaRef);
      if (categorias.empty) {
        alert("Primeiro cadastre as categorias");
        return;
      }
    } catch (error) {
      console.error("Erro ao tentar entrar em produtos", error);
      return;
    }
  }
  if (props.ehBotaoSair === true) {
    destruirStores();
    signOut(auth)
      .then(() => {
        alert("Você foi desconectado.");
        sessionStorage.removeItem("usuario");
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao fazer logout.");
      });
      return;
  }
  if (props.ehBotaoAssinar === true) {
    carregando.value = true;
    textoBotaoPlano.value = "Carregando...";
    botaoDesabilitado.value = "botao-desabilitado";
    console.log("Cliquei");
    try {
      await configStripe();
    } catch (error) {
      console.error("Erro ao tentar ir para a página de pagamento", error);
      carregando.value = false;
      textoBotaoPlano.value = "Assinar agora";
      botaoDesabilitado.value = "";
    }
  }
  if (props.pagina !== "" && props.pagina != 'Configuracoes') {
    router.push(props.pagina);
  }
  if (props.pagina === "Configuracoes") {
    emit('configActive');
  }
}
</script>

<style scoped>
.cards-painel-administrativo {
  display: flex;
  gap: 10px;
}

.botao-desabilitado {
  background-color: #00000065 !important;
  cursor: no-drop !important;
}

.opcoes__botao {
  display: flex;
  flex-direction: column;
  flex: 0 0 calc(33.33% - 1em);
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #e6e6e665;
  border-radius: 8px;
  width: 15rem;
  height: 10rem;
  padding: 10px;
  border: transparent;
  color: var(--cor-principal-fonte);
  text-align: left;
  font-size: 1em;
  align-items: center;
  cursor: pointer;
}

.icone {
  width: 1.5em;
}

@media (max-width: 480px) {
  .opcoes__botao {
    width: 130px;
    height: 100px;
    flex: 0 0 calc(50% - 1em);
  }
}
</style>
