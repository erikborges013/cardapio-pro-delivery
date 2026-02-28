import { collection, onSnapshot } from "firebase/firestore";
import { defineStore } from "pinia";
import { db } from "../firebase-config";
import IAdicionais from "../interfaces/IAdicionais";


export const useAdicionaisStore = defineStore("adicionais", {
  state: () => ({
    listaAdicionais: [] as IAdicionais[],
    adicionalEmEdicao: null as IAdicionais | null,
    pararListener: null as null | (() => void),
  }),
  actions: {
    puxarAdicionais(userId: string) {
      if (this.pararListener) {
        this.pararListener();
        this.pararListener = null;
      }
      const onSnapshotRef = collection(db, "usuarios", userId, "adicionais");
      this.pararListener = onSnapshot(onSnapshotRef, (snapshot) => {
        this.listaAdicionais = snapshot.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome,
          preco: doc.data().preco,
        }))
      })
    },
    selecionaAdicional(adicional: IAdicionais) {
      this.adicionalEmEdicao = { ...adicional };
    }
  }
})
