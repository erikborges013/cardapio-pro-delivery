import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { defineStore } from "pinia";
import { db } from "../firebase-config";

export const formasDePagamentoStore = defineStore("formasDePagamentoStore", {
    state: () => ({
        formasDePagamento: null as string[] | null,
    }),

    actions: {
        async puxarFormasDePagamento(uid: string) {
            this.formasDePagamento = null;
            const docRef = doc(db, "usuarios", uid, "configuracoes", "formas-de-pagamento");
            onSnapshot(doc(db, "usuarios", uid, "configuracoes", "formas-de-pagamento"), (snapshot) => {
                if (!snapshot.exists()) return;
                this.formasDePagamento = snapshot.data().formasPagamento;
            });
        }
    }
})