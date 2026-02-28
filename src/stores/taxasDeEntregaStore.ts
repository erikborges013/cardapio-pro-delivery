import { defineStore } from "pinia";
import ITaxasDeEntrega from "../interfaces/ITaxasDeEntrega";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuthStore } from "./authStore";

export const useTaxasDeEntregaStore = defineStore("taxasDeEntrega", {
    state: () => ({
        taxas: [] as ITaxasDeEntrega[],
        taxaEmEdicao: null as ITaxasDeEntrega | null
    }),

    actions: {
        buscarTaxas(uid: string) {
            
            if (!uid) {
                alert("uid do usuário não encontrado");
                console.error("Uid do usuário não encontrado!");
                return;
            }
            try {
                const colecaoRef = collection(db, "usuarios", uid, "taxas-de-entrega");
                onSnapshot(colecaoRef, (snapshot) => {
                    this.taxas = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...(doc.data() as Omit<ITaxasDeEntrega, "id">)
                    }));
                });

            } catch (error) {
                console.error("Erro ao buscar as taxas de entrega");
            }
        },
        selecionarTaxa(dados: any) {
            this.taxaEmEdicao = {...dados};
        }
    }
})