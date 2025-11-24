<template>
  <v-container>
    <div class="d-flex flex-column align-center justify-center pt-20">
      <AvatarPhoto v-model="form.avatar_url" icon="mdi-account" />
    </div>

    <v-row class="pa-15">
      <v-col cols="12">
        <v-text-field
          v-model="form.name"
          label="Nome"
          variant="outlined"
          density="compact"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="form.email"
          label="E-mail"
          variant="outlined"
          density="compact"
          type="email"
        />
      </v-col>
    </v-row>

    <div style="display: flex; justify-content: end; margin-right: 60px">
      <v-btn color="primary" @click="updateProfile">ALTERAR DADOS</v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import AvatarPhoto from "@/pages/forms/myData/AvatarPhoto.vue";
import { useAuthStore } from "@/stores/auth/User";
import { useSnackbarStore } from "@/stores/snackbarStore";

const form = ref({
  avatar_url: "",
  name: "",
  email: "",
});

const authStore = useAuthStore();
const snackbarStore = useSnackbarStore();

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUserProfile();
  }
  if (authStore.user) {
    form.value.avatar_url = authStore.user.avatar_url || "";
    form.value.name = authStore.user.name;
    form.value.email = authStore.user.email;
  }
});

watch(
  () => authStore.user?.avatar_url,
  (newVal) => {
    if (newVal) form.value.avatar_url = newVal;
  },
  { immediate: true }
);

watch(
  () => form.value.avatar_url,
  (newUrl) => {
    if (newUrl && authStore.user?.avatar_url !== newUrl) {
      const updatedUser = { ...authStore.user!, avatar_url: newUrl };
      authStore.setUser(updatedUser);
    }
  }
);

async function updateProfile() {
  try {
    const updateData = {
      name: form.value.name,
      email: form.value.email,
      avatar_url: form.value.avatar_url,
    };

    const response = await authStore.updateProfile(updateData);

    if (response) {
      snackbarStore.showSnackbar("Dados atualizados!", "success");
    } else {
      snackbarStore.showSnackbar("Falha ao atualizar os dados", "error");
    }
  } catch (error) {
    snackbarStore.showSnackbar("Erro ao atualizar dados", "error");
    throw error;
  }
}
</script>

<style scoped>
.v-text-field {
  font-size: 14px;
}
</style>
