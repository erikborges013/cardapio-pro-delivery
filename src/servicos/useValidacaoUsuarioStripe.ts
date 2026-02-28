import { doc, collection, setDoc, getDoc, DocumentReference, DocumentSnapshot, DocumentData, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { User } from "firebase/auth";
import { getCurrentInstance, onUnmounted, ref } from "vue";
import { buscarDataCriacaoConta } from "../utils/buscarDataDeCriacaoDaConta";
import { testeGratisAtivoStore } from "../stores/testeAtivoStore";

export function useValidarAcesso(user: User) {
  let uid: string = user.uid;
  let usuario: User = user;
  let quantidadeDeDiasGratis: number = 30;
  const assinaturaAtiva = ref(false);
  const testeEstaAtivo = testeGratisAtivoStore();

  const planoAtivoRef = collection(db, "customers", uid, "subscriptions");

  const stop = onSnapshot(planoAtivoRef, (snap) => {
    const ativo = snap.docs.find((doc) => doc.data().status === "active") ? true : false;
    assinaturaAtiva.value = ativo;
  });

  if (getCurrentInstance()) {
    onUnmounted(() => stop());
  }

  async function googleUsando() {
    try {
      const googleAtivoRef = doc(db, "usuarios", uid);
      const googleAtivo: DocumentSnapshot<DocumentData> = await getDoc(googleAtivoRef);
      const googleUsando = googleAtivo.data()?.TesteGoogle || false;
      console.log("Retornando", googleUsando);
      return googleUsando;
    } catch (error) {
      console.error("Erro ao verificar se o google está usando", error);
      return false;
    }
  }

  async function calcularDiferencaEmDias() {
    try {
      const dataCriacaoConta = await buscarDataCriacaoConta();
      const dataAtual: Date = new Date();
      dataAtual.setHours(0,0,0,0);

      const diferencaEmmMs: number = dataAtual.getTime() - dataCriacaoConta.getTime();
      const diferencaEmDias = Math.floor(diferencaEmmMs / (1000 * 60 * 60 * 24));
      const dadosData = {
        dataCriacaoConta,
        diferencaEmDias,
      };
      return dadosData;
    } catch (error) {
      console.error("Erro ao atualizar a data de teste", error);
    }
  }
  const statusAcesso = async function statusAcesso() {
    const googleEstaUsando = await googleUsando();
    console.log(" O google está usando?", googleEstaUsando);
    if (googleEstaUsando === true) {
      console.log("Google play usando a conta - Validação ignorada.");
      return;
    }
    const resultadoCalculo = await calcularDiferencaEmDias();

    if (!resultadoCalculo) {
      console.error("Erro ao pegar resultado do calculo");
      return false;
    }
    const { dataCriacaoConta, diferencaEmDias } = resultadoCalculo;
    const statusTesteRef = doc(db, "usuarios", uid);
    if (diferencaEmDias <= quantidadeDeDiasGratis) {
      const textoTesteGratis = quantidadeDeDiasGratis - diferencaEmDias <= 1 ? `Você tem: ${quantidadeDeDiasGratis - diferencaEmDias} dia de teste grátis. \nApós o término renove por apenas R$ 20,00 mensais` : `Você tem: ${quantidadeDeDiasGratis - diferencaEmDias} dias de teste grátis. \nApós o término renove por apenas R$ 20,00 mensais`;
      testeEstaAtivo.definirTesteGratis(textoTesteGratis);
    } else if (assinaturaAtiva.value === true) {
      console.log("Assinatura está ativa");
      return true;
    } else {
      return false;
    }
    if (diferencaEmDias <= quantidadeDeDiasGratis - 1) {
      
    }
  };

  return { statusAcesso, assinaturaAtiva };
}
