import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { getCurrentInstance, onUnmounted, ref } from "vue";
import { useAuthStore } from "../stores/authStore";

export function useValidarAcesso() {
  const uid = useAuthStore().uid;
  if (!uid) {
    console.log("Uid não encontrado");
    return;
  }
  const assinaturaAtiva = ref(false);


  const statusAcesso = async function statusAcesso() {

    try {
      const planoAtivoRef = collection(db, "customers", uid, "subscriptions");

      const stop = onSnapshot(planoAtivoRef, (snap) => {
        const ativo = snap.docs.find((doc) => doc.data().status === "active") ? true : false;
        assinaturaAtiva.value = ativo;
      });

      if (getCurrentInstance()) {
        onUnmounted(() => stop());
      }

      if (assinaturaAtiva.value === true) {
        console.log("Assinatura está ativa");
        return true;
      } else {
        console.log("assinatura não está ativa");
        return false;
      }

    } catch (error) {
      console.log("Erro ao validar usuário");
    }
  };

  return { statusAcesso, assinaturaAtiva };
}
