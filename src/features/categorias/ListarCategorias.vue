<template>
  <div class="lista-categorias">
  <div
    class="card-categoria"
    v-for="categoria in storeCategorias.categorias"
    :key="categoria.id"
  >
    <div class="info">
      <strong>{{ categoria.dados.nome }}</strong>
      <br>
      <span>Ordem ({{ categoria.dados.ordem }})</span>
    </div>

    <BotaoExcluirDoc
      @confirmar="excluirCategoria(categoria.id)"
    />
    <BotaoEditarDoc @confirmar="editarProduto(categoria)"/>
  </div>
</div>

</template>

<script setup lang="ts">
import BotaoExcluirDoc from "../../components/ui/BotaoExcluirDoc.vue";
import BotaoEditarDoc from "../../components/ui/BotaoEditarDoc.vue";
import { useAuthStore } from "../../stores/authStore";
import { useRouter } from "vue-router";
import { useCategoriaStore } from "../../stores/listaDeCategoriasStore";
import useCategorias from "../../composables/useCategorias";
import Categoria from "../../interfaces/ICategoria";
const storeCategorias = useCategoriaStore()
const uid = useAuthStore().uid;
const router = useRouter();
  const {deletar} = useCategorias(uid!);
  const excluirCategoria = async (id: string) => {
    if(!confirm("Você tem certeza?")) {
      return;
    }
    try {
      await deletar(id);
    } catch (error) {
      console.error("Erro ao tentar excluir categoria", error);
    }
  }
const editarProduto = (categoria: any) => {
  storeCategorias.selecionaCategoria(categoria);
  console.log(categoria)
  router.push("/cadastrarcategorias");
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