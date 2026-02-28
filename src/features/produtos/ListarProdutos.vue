<template>
  <div class="lista-produtos">
  <div
    class="card-produto"
    v-for="lanche in storeProdutos.produtos"
    :key="lanche.id"
  >
    <img :src="lanche.imagemURL || imagemPreviaSemImagem" />

    <div class="info">
      <strong>{{ lanche.nome }}</strong>
      <p>{{ lanche.ingredientes }}</p>
      <span>{{ converterEmReais(lanche.preco) }}</span>
    </div>

    <BotaoExcluirDoc
      @confirmar="excluirProduto(lanche.id, lanche.imagemURL)"
    />
    <BotaoEditarDoc @confirmar="editarProduto(lanche)"/>
  </div>
</div>

</template>

<script setup lang="ts">
import { listaDeProdutos } from "../../stores/listaDeProdutosStore";
import { converterEmReais } from "../../utils/converterEmReais";
import BotaoExcluirDoc from "../../components/ui/BotaoExcluirDoc.vue";
import BotaoEditarDoc from "../../components/ui/BotaoEditarDoc.vue";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "vue-router";
import { IProduto } from "../../interfaces/Iproduto";
import useProduto from "../../composables/useProduto";
import imagemPreviaSemImagem from "../../../assets/vetor-sem-imagem.jpg"
const storeProdutos = listaDeProdutos();  
const uid = useAuthStore().uid;
const router = useRouter();
  const {deletar} = useProduto();
  
  const excluirProduto = async (id: string, imagemURL: string) => {
    if(!confirm("Você tem certeza?")) {
      return;
    }
    try {
      await deletar(`usuarios/${uid}/lanches/${id}`, imagemURL)
    } catch (error) {
      
    }
  }
const editarProduto = (lanche: IProduto) => {
  storeProdutos.selecionarProduto(lanche);
  console.log(storeProdutos.produtoEmEdicao);
  router.push("/cadastrarproduto");
}


</script>

<style scoped>
.lista-produtos {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.card-produto {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: #1f1f1f;
}

.card-produto img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}

.info {
  flex: 1;
}

.info p {
  font-size: 0.85rem;
  opacity: 0.8;
}

@media (min-width: 768px) {
  .lista-produtos {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>