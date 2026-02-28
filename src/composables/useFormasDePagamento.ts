import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export function useFormasDePagamento(uid: string) {
    const enviarParaBancoDeDados = async (opcoesEscolhidas: any) => {
        if (opcoesEscolhidas.length === 0) {
            alert("Selecione pelo menos uma forma de pagamento");
            return;
        }
        try {
            const docRef = doc(db, "usuarios", uid, "configuracoes", "formas-de-pagamento");
            const snapshot = await getDoc(docRef);
            let payLoad: any = {
                formasPagamento: opcoesEscolhidas,
            };
            if (!snapshot.exists()) {
                payLoad.criadoEm = serverTimestamp();
            } else {
                payLoad.atualizadoEm = serverTimestamp();
            }
            await setDoc(docRef, payLoad, { merge: true });
            return true;
        } catch (error) {
            console.error("Erro ao tentar enviar para o banco de dados:", error);
            return false;
        }
    }
    return { enviarParaBancoDeDados };
}