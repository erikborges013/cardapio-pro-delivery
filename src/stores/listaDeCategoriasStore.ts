import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { defineStore } from "pinia";
import { db } from "../firebase-config";
import Categoria from "../interfaces/ICategoria";
import { useAuthStore } from "./authStore";

type dadosCategoria = {
  nome: string,
  ordem: number,
}
const usuario = useAuthStore();

export const useCategoriaStore = defineStore("categorias", {
  state: () => ({
    categorias: [] as Categoria[],
    parar: null as null | (() => void),
    categoriaEmEdicao: null as null | Categoria,
  }),

  actions: {

    async puxarCategorias(uidVindoDoCardapio?: string) {
      this.categorias = [];
      const userId = uidVindoDoCardapio || usuario.uid;
      if (!userId) {
        console.log("Uid do usuário não encontrado");
        return;
      }
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