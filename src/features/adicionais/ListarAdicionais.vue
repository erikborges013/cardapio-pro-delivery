<template>
  <div class="lista-adicionais">
    <div class="card-categoria" v-for="adicional in storeAdicionais.listaAdicionais" :key="adicional.id">
      <div class="info">
        <strong>{{ adicional.nome }}</strong>
        <br>
        <span>{{ converterEmReais(adicional.preco) }}</span>
      </div>

      <BotaoExcluirDoc @confirmar="excluirAdicional(adicional.id)" />
      <BotaoEditarDoc @confirmar="editarAdicional(adicional)" />
    </div>
  </div>

</template>

<script setup lang="ts">
import BotaoExcluirDoc from "../../components/ui/BotaoExcluirDoc.vue";
import BotaoEditarDoc from "../../components/ui/BotaoEditarDoc.vue";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "vue-router";
import { useAdicionaisStore } from "../../stores/listaDeAdicionaisStore";
import { converterEmReais } from "../../utils/converterEmReais";
import useAdicionais from "../../composables/useAdicionais";
import { verificarSeProdutosTemAdicional } from "../../utils/verificarSeProdutoTemAdicional";
const storeAdicionais = useAdicionaisStore();
const uid = useAuthStore().uid;
const router = useRouter();
const excluirAdicional = async (id: string) => {
  if (!uid) {
    console.log("Uid do usuário não encontrado.");
    return
  }
  const { deletar } = useAdicionais(uid);
  const confirmacao = await verificarSeProdutosTemAdicional(uid, id);
  if (!confirmacao) {
    alert("Exclusão cancelada!");
    return;
  }
  const resultado = await deletar(id);
  resultado ? alert("Adicional excluído com sucesso!") : alert("Erro ao excluir adicional");
}
const editarAdicional = (adicional: any) => {
  storeAdicionais.selecionaAdicional(adicional);
  console.log(adicional);
  router.push("/cadastraradicionais");
}
</script>

<style scoped>
.lista-adicionais {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-bottom: 5rem;
}

.card-categoria {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: #1f1f1f;
}

.card-categoria img {
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
  .lista-adicionais {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>