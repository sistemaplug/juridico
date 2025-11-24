<template>
  <v-app>
    <Header v-if="!authStore.isUserLoading" />

    <v-main>
      <router-view />
      <Snackbar />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useAuthStore } from "./stores/auth/User";

const authStore = useAuthStore();
</script>
