<template>
  <div v-if="!authStore.isUserLoading && authStore.user">
    <v-app-bar color="primary" clipped-left app>
      <v-app-bar-nav-icon @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <v-img max-width="100" :src="Logo" style="height: 60px"></v-img>

      <v-toolbar-title>
        <strong> | {{ pageName }} </strong>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu
        offset-y
        v-model="expand"
        :close-on-content-click="false"
        transition="scale-transition"
      >
        <template #activator="{ props }">
          <v-avatar
            v-bind="props"
            size="56"
            style="margin-right: 30px; background-color: transparent"
          >
            <v-img
              v-if="authStore.user?.avatar_url"
              :src="authStore.user.avatar_url"
              alt="Avatar"
            />
            <v-icon v-else size="56" color="white">mdi-account-circle</v-icon>
          </v-avatar>
        </template>

        <v-card class="user-card" style="width: 350px; overflow: hidden">
          <div class="d-flex align-center px-4 py-2">
            <v-avatar size="56" class="no-border-avatar mr-3">
              <v-img
                v-if="authStore.user?.avatar_url"
                :src="authStore.user.avatar_url"
                alt="Avatar"
              />
              <v-icon v-else size="56" color="primary"
                >mdi-account-circle</v-icon
              >
            </v-avatar>

            <div class="d-flex flex-column overflow-hidden">
              <span class="font-weight-medium text-body-1">{{
                authStore.user.name
              }}</span>
              <span class="email-title text-caption text-grey-darken-1">
                {{ authStore.user.email }}
              </span>
            </div>
          </div>

          <v-divider></v-divider>

          <v-list>
            <v-list-item link @click="viewProfile">
              <div style="display: flex; gap: 10px">
                <v-icon size="25" color="primary">mdi-cog-outline</v-icon>
                <v-list-item-title style="font-weight: 500"
                  >Meus dados</v-list-item-title
                >
              </div>
            </v-list-item>
            <v-list-item link @click="logout">
              <div style="display: flex; gap: 10px">
                <v-icon size="25" color="primary">mdi-exit-to-app</v-icon>
                <v-list-item-title style="font-weight: 500"
                  >Sair</v-list-item-title
                >
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- MENU LATERAL DINÂMICO -->
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      mini-variant
      expand-on-hover
      color="primary"
    >
      <v-list>
        <v-list-item
          v-for="item in filteredSidebarItems"
          :key="item.module"
          :to="{ path: item.to }"
          router
        >
          <div class="d-flex ga-3 align-center">
            <v-icon>{{ item.icon }}</v-icon>
            <v-list-item-title style="font-size: 17px; font-weight: 500">
              {{ item.label }}
            </v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
import Logo from "@/assets/img/logo.png";
import { useAuthStore } from "@/stores/auth/User";
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const drawer = ref(false);
const expand = ref(false);
const pageName = ref("Página Inicial");

// Mesmos cards da Home
const cards = [
  {
    label: "Educativa",
    module: "educativa",
    icon: "mdi-school",
    to: "/educativa",
  },
  {
    label: "Engenharia",
    module: "engenharia",
    icon: "mdi-hammer-wrench",
    to: "/engenharia",
  },
  {
    label: "Jurídico",
    module: "juridico",
    icon: "mdi-scale-balance",
    to: "/juridico",
  },
  {
    label: "Manual de Procedimento",
    module: "manual-procedimento",
    icon: "mdi-book-open-variant",
    to: "/manual-procedimento",
  },
  { label: "Radcom", module: "radcom", icon: "mdi-radio-tower", to: "/radcom" },
  {
    label: "Rcial",
    module: "rcial",
    icon: "mdi-briefcase-outline",
    to: "/rcial",
  },
  { label: "RTV", module: "rtv", icon: "mdi-television-classic", to: "/rtv" },
  {
    label: "Usuários",
    module: "usuarios",
    icon: "mdi-account-cog",
    to: "/usuarios",
  },
];

// Mesma lógica da Home
const filteredSidebarItems = computed(() => {
  const user = authStore.user;
  if (!user) return [];

  const role = user.role;

  if (role === "ADMIN") return cards;

  if (role === "SUPPORT") {
    return cards.filter((c) => c.module !== "usuarios");
  }

  if (role === "CUSTOMER") {
    return cards.filter((c) => c.module !== "usuarios");
  }

  return [];
});

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const logout = async () => {
  try {
    await authStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Erro ao deslogar:", error);
  }
};

const viewProfile = () => {
  router.push("/meus-dados");
};

watch(
  () => route.fullPath,
  (path) => {
    switch (path) {
      case "/pagina-inicial":
        document.title = "Página Inicial";
        pageName.value = "Página Inicial";
        break;
      case "/meus-dados":
        document.title = "Meus Dados";
        pageName.value = "Meus Dados";
        break;
      default:
        document.title = "Página desconhecida";
        pageName.value = "Página desconhecida";
        break;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.user-card {
  width: 300px;
}
.no-border-avatar {
  border: none;
}
.email-title {
  font-size: 14px;
  color: gray;
}
</style>
