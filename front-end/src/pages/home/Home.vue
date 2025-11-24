<template>
  <v-container class="pt-11">
    <v-row dense class="ga-6 justify-lg-space-between">
      <!-- Carregamento -->
      <v-col v-if="isLoading" cols="12" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-col>

      <!-- Cards -->
      <v-col
        v-for="card in filteredCards"
        :key="card.label"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card
          class="d-flex align-center justify-center pa-4 ga-6"
          color="cardBackground"
          elevation="2"
          style="height: 120px; cursor: pointer"
          @click="card.onClick"
        >
          <v-icon size="40" class="mb-2">{{ card.icon }}</v-icon>

          <span class="text-subtitle-1 font-weight-medium text-center">
            {{ card.label }}
          </span>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth/User";

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(true);

// Mapeamento entre módulos e cards
const cards = [
  {
    label: "Educativa",
    module: "educativa",
    icon: "mdi-school",
    onClick: () => router.push("/educativa"),
  },
  {
    label: "Engenharia",
    module: "engenharia",
    icon: "mdi-hammer-wrench",
    onClick: () => router.push("/engenharia"),
  },
  {
    label: "Jurídico",
    module: "juridico",
    icon: "mdi-scale-balance",
    onClick: () => router.push("/juridico"),
  },
  {
    label: "Manual de Procedimento",
    module: "manual-procedimento",
    icon: "mdi-book-open-variant",
    onClick: () => router.push("/manual-procedimento"),
  },
  {
    label: "Radcom",
    module: "radcom",
    icon: "mdi-radio-tower",
    onClick: () => router.push("/radcom"),
  },
  {
    label: "Rcial",
    module: "rcial",
    icon: "mdi-briefcase-outline",
    onClick: () => router.push("/rcial"),
  },
  {
    label: "RTV",
    module: "rtv",
    icon: "mdi-television-classic",
    onClick: () => router.push("/rtv"),
  },
  {
    label: "Usuários",
    module: "usuarios",
    icon: "mdi-account-cog",
    onClick: () => router.push("/usuarios"),
  },
];

// Filtro baseado SOMENTE na role
const filteredCards = computed(() => {
  const user = authStore.user;
  if (!user) return [];

  const role = user.role;

  // ADMIN → tudo
  if (role === "ADMIN") {
    return cards;
  }

  // SUPPORT → tudo menos usuários
  if (role === "SUPPORT") {
    return cards.filter((card) => card.module !== "usuarios");
  }

  // CUSTOMER → tudo menos usuários
  if (role === "CUSTOMER") {
    return cards.filter((card) => card.module !== "usuarios");
  }

  return [];
});

onMounted(async () => {
  if (!authStore.user?.id) {
    await authStore.fetchUserProfile();
  }
  isLoading.value = false;
});
</script>
