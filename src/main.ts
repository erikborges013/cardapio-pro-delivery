// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import './assets/tailwind.css'
import router from "./router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { useAuthStore } from "./stores/authStore";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

let appMontado: boolean = false;

// Observa o estado da autenticação apenas para inicializar o store e montar o app
onAuthStateChanged(auth, async (user) => {
  const authStore = useAuthStore();
  
  // Atualiza o store com o utilizador atual (ou null)
  authStore.definirUsuario(user);

  // Apenas monta a aplicação na primeira vez
  if (!appMontado) {
    // Removemos toda a lógica de "if (user) router.replace..." daqui
    // O router/index.ts agora cuida disso sozinho.
    
    app.mount("#app");
    appMontado = true;
  }
});