import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { defineStore } from "pinia";
import { db } from "../firebase-config";
import Categoria from "../interfaces/ICategoria";

type dadosCategoria = {
  nome: string,
  ordem: number,
}

export const useCategoriaStore = defineStore("categorias", {
  state: () => ({
    categorias: [] as Categoria[],
    parar: null as null | (() => void),
    categoriaEmEdicao: null as null | Categoria,
  }),

  actions: {

    async puxarCategorias(userId: string) {
      const categoriasRef = collection(db, "usuarios", userId, "categorias");
      const documento = await getDocs(categoriasRef);

      if (!documento.empty) {

        this.categorias = documento.docs.map((doc) => ({
          id: doc.id,
          dados: { nome: doc.data().nome, ordem: doc.data().ordem } as dadosCategoria
        }))
      }
    },
    selecionaCategoria(categoria: Categoria) {
      this.categoriaEmEdicao = { ...categoria };
    }
  }
})