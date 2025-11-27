import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import { jwtDecode } from "jwt-decode"; // instale com: npm i jwt-decode
import { routes as autoRoutes } from "vue-router/auto-routes";
import Login from "@/pages/forms/login/Login.vue";
import { useAuthStore } from "@/stores/auth/User";
import Index from "@/pages/forms/myData/Index.vue";
import { useSnackbarStore } from "@/stores/snackbarStore";
import PersonHome from "@/pages/contractors/ContractorHome.vue";

const manualRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    component: Login,
    meta: { title: "Login", auth: true },
  },
  {
    path: "/meus-dados",
    component: Index,
    meta: { title: "Meus Dados", auth: true },
  },

  {
    path: "/clientes",
    component: PersonHome,
    meta: { title: "Clientes", auth: true },
  },
];

const routes = setupLayouts([...autoRoutes, ...manualRoutes]);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const snackbarStore = useSnackbarStore();

  // Define título da página
  if (to.meta.title) {
    document.title = `Jurídico | ${to.meta.title}`;
  }

  const publicRoutes = ["/login"];
  const isPublic = publicRoutes.includes(to.path);
  const token = authStore.token;

  // Sempre limpar tudo e exibir "Logout realizado" ao acessar /login
  if (to.path === "/login") {
    const tinhaSessao = !!authStore.token || !!authStore.user;
    authStore.setUser(null);
    authStore.setToken(null);
    authStore.sessionExpired = false;
    localStorage.clear();

    // Mostra snackbar sempre, inclusive se for digitado direto na URL
    if (tinhaSessao || from.path !== "/login") {
      snackbarStore.showSnackbar("Logout realizado!", "success");
    }
  }

  // Verificar expiração do token
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        console.warn("Token expirado!");
        await authStore.logout();
        snackbarStore.showSnackbar("Logout realizado!", "success");
        return next("/login");
      }
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      await authStore.logout();
      snackbarStore.showSnackbar("Logout realizado!", "success");
      return next("/login");
    }
  }

  // Bloquear acesso a rotas privadas sem token
  if (!token && !isPublic) {
    console.warn("Acesso negado — usuário sem token.");
    return next("/login");
  }

  // Se estiver logado e tentar acessar /login → redireciona à home
  if (token && isPublic) {
    return next("/clientes");
  }

  // Carregar perfil do usuário, se ainda não tiver sido carregado
  if (token && !authStore.user) {
    try {
      await authStore.fetchUserProfile();
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      await authStore.logout();
      snackbarStore.showSnackbar("Logout realizado!", "success");
      return next("/login");
    }
  }

  next();
});

router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
