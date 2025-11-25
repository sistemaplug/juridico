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

      <v-spacer />

      <!-- MENU DO USUÁRIO (avatar) -->
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
              <span class="font-weight-medium text-body-1">
                {{ authStore.user.name }}
              </span>
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
                <v-list-item-title style="font-weight: 500">
                  Meus dados
                </v-list-item-title>
              </div>
            </v-list-item>

            <v-list-item link @click="logout">
              <div style="display: flex; gap: 10px">
                <v-icon size="25" color="primary">mdi-exit-to-app</v-icon>
                <v-list-item-title style="font-weight: 500">
                  Sair
                </v-list-item-title>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- MENU LATERAL -->
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
          :key="item.to"
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
const pageName = ref("Clientes");

// MENU LATERAL
const cards = [
  {
    label: "Clientes",
    icon: "mdi-account-group",
    to: "/clientes",
  },
  {
    label: "Usuários",
    icon: "mdi-account-cog",
    to: "/usuarios",
    adminOnly: true,
  },
];

const filteredSidebarItems = computed(() => {
  const user = authStore.user;
  if (!user) return [];

  if (user.role === "ADMIN") return cards;

  return cards.filter((c) => !c.adminOnly);
});

// EVENTOS
const toggleDrawer = () => (drawer.value = !drawer.value);

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};

const viewProfile = () => router.push("/meus-dados");

// CONTROLE DO TÍTULO
watch(
  () => route.fullPath,
  (path) => {
    switch (path) {
      case "/clientes":
        document.title = "Clientes";
        pageName.value = "Clientes";
        break;
      case "/meus-dados":
        document.title = "Meus Dados";
        pageName.value = "Meus Dados";
        break;
      case "/usuarios":
        document.title = "Usuários";
        pageName.value = "Usuários";
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
