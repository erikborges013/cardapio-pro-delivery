<template>
  <h4 class="texto-link-do-cardapio">Link do cardápio</h4>
  <div class="compartilhar-cardapio">
    <BaseInput tipo="text" :obrigatorio="false" :value="input" ref="inputE1" />
    <BaseButtonGenerico @click="btnCopiarLink" texto="Copiar link" />
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase-config";
import { ref, watch } from "vue";
import BaseInput from "../../components/ui/BaseInput.vue";
import BaseButtonGenerico from "../../components/ui/BaseButtonGenerico.vue";
import { nextTick } from "vue";
import { useAuthStore } from "../../stores/authStore";
let btnCopiarLink: () => void;
const input = ref("");
const inputE1 = ref<any>(null);

const uid = useAuthStore().uid;

const uidInterno = ref(uid);

watch(
  () => uid,
  (val) => {
    if (val) {
      uidInterno.value = val;
      liberarLink();
    }
  }
);

btnCopiarLink = async function btnCopiarLink() {
  if (!uid) {
    console.error("usuário não autenticado", Error);
    return;
  }
  try {
    const refs = [doc(db, "usuarios", uid, "configuracoes", "dados-principais"), doc(db, "usuarios", uid, "configuracoes", "formas-de-pagamento")];
    const taxaDeEntregaRef = collection(db, "usuarios", uid, "taxas-de-entrega");
    const taxasDeEntrega = await getDocs(taxaDeEntregaRef);

    const snapshot = await Promise.all(refs.map((ref) => getDoc(ref)));
    if (!snapshot[0].exists()) {
      alert("Primeiro preencha as informações do cardápio em configurações");
      return;
    }
    if (!snapshot[1].exists()) {
      alert("Primeiro selecione as formas de pagamento em configurações");
      return;
    }
    if (taxasDeEntrega.empty) {
      alert("Primeiro cadastre as taxas de entrega");
      return;
    }
  } catch (error) {
    console.error("configuracões não encontrado", error);
  }
  input.value = `https://cardapiodigital.vercel.app/cardapio/${uid}`;
  await nextTick();
  if (inputE1.value) {
    const elementoNativo = inputE1.value.inputRef;
    if (elementoNativo) {
      elementoNativo.select();
      elementoNativo.setSelectionRange(0, 99999);
      navigator.clipboard
        .writeText(input.value)
        .then(() => {
          alert("Link copiado para a área de transferência!");
        })
        .catch((err) => {
          console.error("Erro ao copiar link", err);
        });
    }
  }
};

async function liberarLink(): Promise<void> {
  try {
    if (!uid) {
      console.error("UID do usuário não encontrado");
      return;
    }
    const refs = [doc(db, "usuarios", uid, "configuracoes", "dados-principais"), doc(db, "usuarios", uid, "configuracoes", "formas-de-pagamento")];
    const taxaDeEntregaRef = collection(db, "usuarios", uid, "taxas-de-entrega");
    const taxasDeEntrega = await getDocs(taxaDeEntregaRef);

    const snapshot = await Promise.all(refs.map((ref) => getDoc(ref)));
    if (!snapshot[0].exists()) {
      input.value = "Primeiro preencha as informações do cardápio";
      return;
    }
    if (!snapshot[1].exists()) {
      input.value = "Primeiro selecione as formas de pagamento";
      return;
    }
    if (taxasDeEntrega.empty) {
      input.value = "Primeiro cadastre as taxas de entregas";
      return;
    }
  } catch (error) {
    console.error("configuracões não encontrado", error);
  }

  input.value = `https://cardapiodigital.vercel.app/cardapio/${uid}`;
}
liberarLink();
</script>

<style scoped>
.texto-link-do-cardapio {
  text-align: center;
  font-weight: 400;
}

.compartilhar-cardapio {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0px;
  align-items: center;
  width: 50%;
}

#link-cardapio {
  padding: 8px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .compartilhar-cardapio {
    width: 80%;
  }
}
</style>
