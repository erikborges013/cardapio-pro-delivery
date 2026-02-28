import { DocumentData, getDocs } from "firebase/firestore";
import { defineStore } from "pinia";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { useAuthStore } from "./authStore";
import { db } from "../firebase-config";
import { IProduto } from "../interfaces/Iproduto";

export const listaDeProdutos = defineStore("produtos", {
    state: () => ({
        produtos: [] as IProduto[],
        produtoEmEdicao: null as null | IProduto,
    }),

    actions: {
        async buscarProdutos(userId?: string) {
            const uid = userId || useAuthStore().uid;
            if (!uid) {
                console.log("uid não encontrado");
                return;
            }
            const lanchesRef = collection(db, "usuarios", uid, "lanches");
            const q = query(lanchesRef, orderBy("criadoEm", "desc"));

            const produtos = await getDocs(q);

            if (!produtos.empty) {
                this.produtos = produtos.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as Omit<IProduto, "id">)
                }));
            }
        },
        selecionarProduto(produto: IProduto) {
            this.produtoEmEdicao = { ...produto }
        }
    }


})