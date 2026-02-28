import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

export async function validarAcessoCardapioPublico(uid: string): Promise<boolean> {
  try {
    // 1. Busca dados do Usuário (Para verificar TesteGoogle e Data de Criação)
    const userRef = doc(db, "usuarios", uid);
    const userSnap = await getDoc(userRef);
    const dadosUser = userSnap.data();

    // --- LÓGICA 1: IGUAL AO useValidacaoUsuarioStripe (TesteGoogle) ---
    if (dadosUser?.TesteGoogle === true) {
        console.log("Google play usando a conta - Validação ignorada.");
        return true;
    }

    // --- LÓGICA 2: IGUAL AO useValidacaoUsuarioStripe (Cálculo de Dias) ---
    let dentroDoPeriodoDeTeste = false;
    const quantidadeDeDiasGratis = 30;

    if (dadosUser?.createdAt) {
        // Converte Timestamp do Firebase para Date
        const dataCriacao = dadosUser.createdAt.toDate();
        
        // Zera as horas para comparação de dias inteiros (igual ao teu utilitário)
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);
        
        const dataCriacaoZerada = new Date(dataCriacao);
        dataCriacaoZerada.setHours(0, 0, 0, 0);

        const diferencaEmMs = dataAtual.getTime() - dataCriacaoZerada.getTime();
        const diferencaEmDias = Math.floor(diferencaEmMs / (1000 * 60 * 60 * 24));

        console.log(`Dias de uso: ${diferencaEmDias} / ${quantidadeDeDiasGratis}`);

        if (diferencaEmDias <= quantidadeDeDiasGratis) {
            dentroDoPeriodoDeTeste = true;
        }
    }

    // --- LÓGICA 3: IGUAL AO useValidacaoUsuarioStripe (Status Active) ---
    let assinaturaAtiva = false;
    const subsRef = collection(db, "customers", uid, "subscriptions");
    const subsSnap = await getDocs(subsRef);

    if (!subsSnap.empty) {
        // Procura exatamente por status === "active"
        const temAtiva = subsSnap.docs.find(doc => doc.data().status === "active");
        if (temAtiva) {
            assinaturaAtiva = true;
        }
    }

    // --- DECISÃO FINAL (Igual ao if/else original) ---
    if (dentroDoPeriodoDeTeste) {
        return true;
    } else if (assinaturaAtiva) {
        return true;
    } else {
        return false;
    }

  } catch (error) {
    console.error("Erro na validação pública:", error);
    return false;
  }
}