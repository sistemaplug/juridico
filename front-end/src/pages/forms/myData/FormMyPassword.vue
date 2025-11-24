<template>
  <v-container>
    <v-form class="pt-10">
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.newPassword"
            label="Nova senha"
            filled
            variant="outlined"
            density="compact"
            :rules="[rules.required]"
            :type="showNewPassword ? 'text' : 'password'"
            @click:append-inner="showNewPassword = !showNewPassword"
            :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            v-model="form.confirmPassword"
            label="Confirme a nova senha"
            filled
            variant="outlined"
            density="compact"
            :rules="[rules.required]"
            :type="showConfirmPassword ? 'text' : 'password'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-list class="pl-0 ml-0" dense>
            <v-list-item
              v-for="(criterion, key) in criteriaMessages"
              :key="key"
              class="pl-0 ml-0"
              :class="{
                'text-success': passwordCriteria[key],
                'text-error': !passwordCriteria[key],
              }"
            >
              <v-icon
                left
                :class="{
                  'icon-success': passwordCriteria[key],
                  'icon-error': !passwordCriteria[key],
                }"
              >
                {{
                  passwordCriteria[key]
                    ? "mdi-check-circle"
                    : "mdi-close-circle"
                }}
              </v-icon>
              {{ criterion }}
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-form>
    <div
      class="d-flex justify-end"
      style="margin-top: 20px; margin-right: 30px"
    >
      <v-btn @click="updatePassword" color="primary"> Atualizar Senha </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "../../../stores/auth/User";
import { useSnackbarStore } from "../../../stores/snackbarStore";
import { useRouter } from "vue-router";

const form = ref({
  newPassword: "",
  confirmPassword: "",
});

const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const authStore = useAuthStore();
const snackbarStore = useSnackbarStore();
const router = useRouter();

const criteriaMessages = {
  length: "Precisa ter no mínimo 8 caracteres",
  uppercase: "Precisa ter pelo menos uma letra maiúscula",
  lowercase: "Precisa ter pelo menos uma letra minúscula",
  special: "Precisa ter pelo menos um caractere especial",
  number: "Precisa ter pelo menos um dígito numérico",
  match: "As senhas precisam ser iguais",
};

const passwordCriteria = computed(() => ({
  length: form.value.newPassword.length >= 8,
  uppercase: /[A-Z]/.test(form.value.newPassword),
  lowercase: /[a-z]/.test(form.value.newPassword),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(form.value.newPassword),
  number: /\d/.test(form.value.newPassword),
  match:
    form.value.newPassword.length > 0 &&
    form.value.newPassword === form.value.confirmPassword,
}));

const rules = {
  required: (value: string) => !!value || "Campo obrigatório",
};

async function updatePassword() {
  if (!form.value.newPassword || !form.value.confirmPassword) {
    snackbarStore.showSnackbar("Todos os campos são obrigatórios!", "error");
    return;
  }

  if (Object.values(passwordCriteria.value).includes(false)) {
    snackbarStore.showSnackbar(
      "A nova senha não atende aos critérios!",
      "error"
    );
    return;
  }

  try {
    const passwordData = {
      new_password: form.value.newPassword,
    };

    const response = await authStore.updatePassword(passwordData);

    if (response) {
      snackbarStore.showSnackbar(
        "Senha atualizada! Faça login novamente.",
        "success"
      );

      // Limpa sessão antes de redirecionar
      await authStore.logout();

      // Redireciona para o login
      router.push("/login");
    }
  } catch (error) {
    snackbarStore.showSnackbar(
      "A nova senha não pode ser igual à atual!",
      "error"
    );
    console.error(error);
  }
}
</script>

<style scoped>
.text-success {
  color: green !important;
}

.text-error {
  color: red !important;
}

.icon-success {
  color: green !important;
}

.icon-error {
  color: red !important;
}
</style>
