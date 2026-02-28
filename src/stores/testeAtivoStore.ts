import { defineStore } from "pinia";
import { db, doc } from "../firebase-config";
import { useAuthStore } from "./authStore";
import { getDoc } from "firebase/firestore";




export const testeGratisAtivoStore = defineStore("validaTesteGratis", {
    state: () => ({
        usuarioEmTeste: false as boolean,
        quantidadeDeDiasGratis: "" as string,
    }),
    actions: {
        async definirTesteGratis( textoDiasGratis: string) {
            const userUid = useAuthStore().uid!;
            const ref = doc(db, "usuarios", userUid);
            try {
                const usuarioEmTeste = await getDoc(ref);
                const testeAtivo = usuarioEmTeste.data()?.statusTesteGratis;
                this.usuarioEmTeste = testeAtivo
                this.quantidadeDeDiasGratis = textoDiasGratis;
            } catch (error) {
                console.error("Erro ao verificar se o teste grátis está ativo", error);
            }
            
        }
    }
})