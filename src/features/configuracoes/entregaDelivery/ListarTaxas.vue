<template>
  <div class="lista-categorias">
  <div
    class="card-categoria"
    v-for="taxa in storeTaxas.taxas"
    :key="taxa.id"
  >
    <div class="info">
      <strong>{{ taxa.nome }}</strong>
      <br>
      <span> {{ converterEmReais(taxa.taxa) }}</span>
    </div>

    <BotaoExcluirDoc
      @confirmar="excluirTaxa(taxa.id)"
    />
    <BotaoEditarDoc @confirmar="editarTaxa(taxa)"/>
  </div>
</div>

</template>

<script setup lang="ts">
import BotaoExcluirDoc from "../../../components/ui/BotaoExcluirDoc.vue";
import BotaoEditarDoc from "../../../components/ui/BotaoEditarDoc.vue";
import { useAuthStore } from "../../../stores/authStore";
import { useRouter } from "vue-router";
import { useTaxasDeEntregaStore } from "../../../stores/taxasDeEntregaStore";
import useTaxasDeEntrega from "../../../composables/useTaxasDeEntrega";
import { converterEmReais } from "../../../utils/converterEmReais";


const storeTaxas = useTaxasDeEntregaStore();
const uid = useAuthStore().uid;
const router = useRouter();
  const {deletar} = useTaxasDeEntrega(uid!);
  const excluirTaxa = async (id: string) => {
    if(!confirm("Você tem certeza?")) {
      return;
    }
    try {
      await deletar(id);
    } catch (error) {
      console.error("Erro ao tentar excluir taxa de entrega", error);
    }
  }
const editarTaxa = (taxa: any) => {
  storeTaxas.selecionarTaxa(taxa);
  router.push("/cadastrartaxa");
}


</script>

<style scoped>
.lista-categorias {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
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
  .lista-categorias {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>