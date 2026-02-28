import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase-config";
import Auth from "../features/autenticacao/Auth.vue";
import { informacoesDoCardapioStore } from "../stores/informacoesDoCardapioStore";

const routes: RouteRecordRaw[] = [
  {
    path: "/cardapio/:uid",
    name: "cardapio-publico",
    component: () => import("../features/cardapio/Cardapio.vue"),
    meta: { requiresAuth: false }
  },


  {
    path: "/login",
    name: "login",
    component: Auth,
    meta: { requiresAuth: false }
  },
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/admin",
    name: "admin",
    component: () => import("../features/painelAdministrativo/Admin.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/produtos",
    name: "produtos",
    component: () => import("../features/produtos/Produtos.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/cadastrarproduto",
    name: "cadastrarprodutos",
    component: () => import("../features/produtos/CadastrarProdutos.vue"),
    meta: { requiresAuth: true },
    
  },
  {
    path: "/categorias",
    name: "categorias",
    component: () => import("../features/categorias/Categorias.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/cadastrarcategorias",
    name: "cadastrarcategorias",
    component: () => import("../features/categorias/CadastrarCategorias.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/adicionais",
    name: "adicionais",
    component: () => import("../features/adicionais/Adicionais.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/cadastraradicionais",
    name: "cadastraradicionais",
    component: () => import("../features/adicionais/CadastrarAdicionais.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/configuracoes",
    name: "configuracoes",
    component: () => import("../features/configuracoes/Configuracoes.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/taxasdeentrega",
    name: "taxasdeentrega",
    component: () => import("../features/configuracoes/entregaDelivery/TaxasDeEntrega.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/cadastrartaxa",
    name: "cadastrartaxa",
    component: () => import("../features/configuracoes/entregaDelivery/CadastrarTaxa.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/informacoesdocardapio",
    name: "informacoesdocardapio",
    component: () => import("../features/configuracoes/informacoesDoCardapio/InformacoesDoCardapio.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/formasdepagamento",
    name: "formasdepagamento",
    component: () => import("../features/configuracoes/formasDePagamento/FormasDePagamento.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/onboarding",
    name: "onboarding",
    component: () => import("../features/onboarding/OnBoarding.vue"),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const currentUser: User | null = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

  if (requiresAuth) {
    // Se não está logado, chuta para o login na hora
    if (!currentUser) {
      return next("/login");
    }

    // Agora é seguro invocar a store, pois o app já inicializou e o usuário existe
    const store = informacoesDoCardapioStore();

    if (!store.informacoesDoEstabelecimento) {
      await store.puxarInfoDoEstabelecimento(currentUser.uid);
    }

    const informacoesCadastradas = store.informacoesDoEstabelecimento;

    if (!informacoesCadastradas && to.name !== "onboarding") {
      return next("/onboarding");
    }

    if (informacoesCadastradas && to.name === "onboarding") {
      return next("/admin");
    }

    return next();

  } else {
    if (currentUser && (to.name === 'login' || to.path === '/login' || to.path === '/')) {
      return next("/admin");
    }
    return next();
  }
});
export default router;