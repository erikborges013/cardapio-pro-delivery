import { doc, getDoc } from "firebase/firestore"; 
import { defineStore } from "pinia";
import { IInformacoesDoCardapio } from "../interfaces/IInformacoesDoCardapio";
import { db } from "../firebase-config";

export const informacoesDoCardapioStore = defineStore("informacoesDoCardapio", {
    state: () => ({
        informacoesDoEstabelecimento: null as IInformacoesDoCardapio | null,
        telaPronta: false as boolean,
    }),

    actions: {
        async puxarInfoDoEstabelecimento(uid: string) {
            try {
                this.telaPronta = false;
                this.informacoesDoEstabelecimento = null;

                const docRef = doc(db, "usuarios", uid, "configuracoes", "dados-principais");
                
                const snapshot = await getDoc(docRef);

                if (snapshot.exists()) {
                    this.informacoesDoEstabelecimento = snapshot.data() as IInformacoesDoCardapio;
                    
                    const url = this.informacoesDoEstabelecimento.imagemUrl;
                    if (url) {
                        await new Promise((resolve) => {
                            const img = new Image();
                            img.src = url;
                            img.onload = resolve;
                            img.onerror = resolve;
                        });
                    }
                }

            } catch (error) {
                console.error("Erro ao tentar preencher as informações do cardápio", error);
            } finally {
                this.telaPronta = true;
            }
        }
    }
})