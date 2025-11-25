<template>
  <div
    class="login-background d-flex align-center justify-center"
    style="min-height: 100vh"
  >
    <v-card
      class="pa-12 pb-8 login-card"
      elevation="8"
      width="500"
      rounded="lg"
    >
      <!-- Ícone flutuante acima do card -->
      <div class="icon-wrapper">
        <div class="icon-circle">
          <v-icon size="70" color="white">mdi-account-outline</v-icon>
        </div>
      </div>

      <v-img class="mx-auto my-6" max-width="228" :src="Logo"></v-img>

      <div class="text-subtitle-1 text-medium-emphasis font-weight-bold mt-10">
        Usuário
      </div>

      <v-text-field
        v-model="inputEmail"
        placeholder="Usuário"
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-account-outline"
        @keyup.enter="submitUser"
        :disabled="loading"
      />

      <div
        class="text-subtitle-1 text-medium-emphasis font-weight-bold d-flex align-center justify-space-between"
      >
        Senha
      </div>

      <v-text-field
        v-model="inputPassword"
        placeholder="Senha"
        prepend-inner-icon="mdi-lock-outline"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        @click:append-inner="visible = !visible"
        variant="outlined"
        density="compact"
        @keyup.enter="submitUser"
        :disabled="loading"
      />

      <v-card-actions class="d-flex justify-center align-center">
        <v-btn
          @click="submitUser"
          :loading="loading"
          :disabled="loading"
          style="
            background-color: #1e90ff;
            color: white;
            width: 100%;
            height: 50px;
            font-size: 16px;
            font-weight: bold;
          "
        >
          <template v-if="!loading">Entrar</template>
          <template v-else>Carregando...</template>
        </v-btn>
      </v-card-actions>

      <div class="d-flex justify-center mt-4">
        <span>Sistema Plug © 2025 </span>
      </div>
    </v-card>

    <v-overlay v-if="loading" absolute>
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script lang="ts" setup>
import Logo from "@/assets/img/plug-logo.png";
import { useAuthStore } from "@/stores/auth/User";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useRouter } from "vue-router";

declare const grecaptcha: any;

const inputEmail = ref("");
const inputPassword = ref("");
const loading = ref(false);
const visible = ref(false);

const authStore = useAuthStore();
const snackbarStore = useSnackbarStore();
const router = useRouter();

onMounted(() => {
  // Carrega o reCAPTCHA se ainda não estiver no DOM
  if (typeof grecaptcha === "undefined") {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.head.appendChild(script);
  }

  // Se sessão anterior expirou, mostra aviso
  if (authStore.sessionExpired) {
    snackbarStore.showSnackbar(
      "Sessão expirada. Faça login novamente.",
      "warning"
    );
    authStore.sessionExpired = false;
  }
});

async function submitUser() {
  loading.value = true;

  try {
    if (typeof grecaptcha === "undefined") {
      snackbarStore.showSnackbar("reCAPTCHA não carregado!", "error");
      return;
    }

    const recaptchaToken = await new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: "login" })
          .then(resolve)
          .catch(reject);
      });
    });

    // Faz login (a store controla tudo: bloqueio, snackbar e update)
    await authStore.login(
      inputEmail.value,
      inputPassword.value,
      recaptchaToken
    );

    // Se o usuário existir e estiver ativo → redireciona
    if (authStore.user && authStore.user.is_active) {
      router.push("/clientes");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    // Sem snackbar aqui — a store já mostra
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-background {
  background-image: url("https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?cs=srgb&dl=pexels-umkreisel-app-956999.jpg&fm=jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-card {
  position: relative;
  overflow: visible; /* importante para o ícone sair do card */
}

/* wrapper centraliza o círculo */
.icon-wrapper {
  position: absolute;
  top: -55px; /* sobe o ícone acima do card */
  left: 50%;
  transform: translateX(-50%);
}

/* círculo com efeito 3D */
.icon-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e90ff, #00bfa6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.25);
}
</style>
