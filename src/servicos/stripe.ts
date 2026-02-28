import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase-config";

export function configStripe(): void {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const uid = user.uid;

      // ID do Preço que você copiou do painel do Stripe
      const priceId = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

      // 1. Cria a referência para a coleção de checkout_sessions do cliente
      const checkoutSessionRef = collection(db, "customers", uid, "checkout_sessions");

      // 2. Adiciona um novo documento. A extensão vai detectar isso.
      try {
        const docRef = await addDoc(checkoutSessionRef, {
          price: priceId,
          success_url: window.location.origin + "/Admin",
          cancel_url: window.location.origin + "/Admin",
        });
        // 3. Escuta as mudanças no documento que acabou de criar
        onSnapshot(docRef, (snap) => {
          const dados = snap.data();
          if (dados) {
            const { error, url } = dados;
            if (error) {
              // Mostra um erro se o checkout falhar
              alert(`Ocorreu um erro: ${error.message}`);
            }
            if (url) {
              // 4. Se a URL existir, redireciona o cliente para o pagamento
              window.location.assign(url);
            }
          }
        });
      } catch (error) {
        console.error("Erro ao adicionar novo usuário ao stripe", error);
        //subscribeButton.disabled = false;
        //textoBtnAssinar.textContent = "Assinar Plano";
      }
    }
  });
}
