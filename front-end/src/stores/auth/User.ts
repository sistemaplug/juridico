import { defineStore } from "pinia";
import { API } from "@/services/module/API";
import axios from "axios";
import type {
  DataUser,
  NewDataUser,
  UpdateProfileData,
} from "@/types/UserTypes";
import { useSnackbarStore } from "../snackbarStore";

interface AuthState {
  user: DataUser | null;
  sessionExpired: boolean;
  token: string | null;
  isUserLoading: boolean;
  loginAttempts: number;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    sessionExpired: false,
    token: localStorage.getItem("@system_plug_juridico.access_token") || null,
    isUserLoading: true,
    loginAttempts: 0,
  }),

  actions: {
    async login(email: string, password: string, recaptchaToken: string) {
      const snackbarStore = useSnackbarStore();

      try {
        snackbarStore.showSnackbar("Realizando login...", "loading");

        const { accessToken } = await API.auth.login({
          email,
          password,
          recaptchaToken,
        });

        // Se o backend não retornou token → erro direto
        if (!accessToken) {
          snackbarStore.showSnackbar("Erro ao realizar o login!", "error");
          return;
        }

        // Define token e busca perfil
        this.setToken(accessToken);
        const user = await this.fetchUserProfile();

        // Se o usuário estiver bloqueado, impede o acesso
        if (!user?.is_active) {
          snackbarStore.showSnackbar(
            "Acesso bloqueado, entre em contato com o administrador.",
            "error"
          );
          this.setToken(null);
          this.setUser(null);
          return;
        }

        // Login bem-sucedido → zera tentativas
        localStorage.removeItem("@system_plug_juridico.login_attempts");
        snackbarStore.showSnackbar("Login realizado!", "success");
      } catch (error: any) {
        const backendMessage =
          error?.response?.data?.message?.toLowerCase?.() || "";

        // Se o backend retornou bloqueio
        if (backendMessage.includes("bloqueado")) {
          snackbarStore.showSnackbar(
            "Acesso bloqueado, entre em contato com o administrador.",
            "error"
          );
          this.setToken(null);
          this.setUser(null);
          return;
        }

        // Controle de tentativas (somente se o usuário ainda não estiver bloqueado)
        const currentAttempts =
          Number(
            localStorage.getItem("@system_plug_juridico.login_attempts") || "0"
          ) + 1;
        localStorage.setItem(
          "@system_plug_juridico.login_attempts",
          currentAttempts.toString()
        );

        if (currentAttempts >= 3) {
          try {
            // Bloqueia o usuário no backend
            await API.auth.blockUserByEmail({ email });
            console.warn(`Usuário ${email} bloqueado (is_active = false)`);
          } catch (err) {
            console.error("Erro ao bloquear usuário no banco:", err);
          }

          snackbarStore.showSnackbar(
            "Acesso bloqueado, entre em contato com o administrador.",
            "error"
          );

          // limpa contador após bloqueio
          localStorage.removeItem("@system_plug_juridico.login_attempts");
        } else {
          snackbarStore.showSnackbar("E-mail ou senha inválidos!", "error");
        }

        throw error;
      }
    },

    async fetchUserProfile() {
      this.isUserLoading = true;
      try {
        const user = await API.auth.profile();
        this.setUser(user);
        return user;
      } catch (error) {
        console.error("Erro ao buscar o perfil do usuário:", error);
        this.setUser(null);
      } finally {
        this.isUserLoading = false;
      }
    },

    async uploadAvatar(imageFile: File) {
      const snackbarStore = useSnackbarStore();
      try {
        snackbarStore.showSnackbar("Atualizando foto...", "loading");

        const imageUrl = await API.uploadService.uploadImage(imageFile);

        const updatedUser = await API.auth.updateAvatar({ url: imageUrl });

        if (updatedUser.avatar_url) {
          this.setUser(updatedUser);
          snackbarStore.showSnackbar("Foto atualizada!", "success");
        } else {
          snackbarStore.showSnackbar("Falha ao atualizar a foto", "error");
        }
      } catch (error) {
        snackbarStore.showSnackbar("Erro ao atualizar foto", "error");
        console.error("Erro ao atualizar avatar:", error);
      }
    },

    async updateProfile(profileData: UpdateProfileData): Promise<boolean> {
      const snackbarStore = useSnackbarStore();
      try {
        snackbarStore.showSnackbar("Atualizando perfil...", "loading");

        // Somente espalha os dados do profile, sem salary ou billing_day
        const payload: Partial<DataUser> = {
          ...profileData,
        };

        const updatedUser = await API.auth.updateProfile(payload);
        this.setUser(updatedUser);

        snackbarStore.showSnackbar("Perfil atualizado!", "success");
        return true;
      } catch (error) {
        snackbarStore.showSnackbar("Erro ao atualizar perfil!", "error");
        return false;
      }
    },

    async updatePassword(passwordData: {
      new_password: string;
    }): Promise<boolean> {
      const snackbarStore = useSnackbarStore();
      try {
        snackbarStore.showSnackbar("Atualizando senha...", "loading");
        await API.auth.updatePassword(passwordData);
        snackbarStore.showSnackbar("Senha atualizada!", "success");
        return true;
      } catch (error) {
        snackbarStore.showSnackbar(
          "A nova senha não pode ser igual à atual!",
          "error"
        );
        console.error(error);
        return false;
      }
    },

    async logout(isExpired = false) {
      const snackbarStore = useSnackbarStore();

      try {
        // Se logout for MANUAL, avisa
        if (!isExpired) {
          snackbarStore.showSnackbar("Realizando logout...", "loading");
          await API.auth.logout().catch(() => {});
        }
      } catch (error) {
        console.warn(
          "Erro durante logout (ignorado se token expirado):",
          error
        );
      } finally {
        this.setToken(null);
        this.user = null;

        // Se foi expiração
        if (isExpired) {
          snackbarStore.showSnackbar(
            "Sessão expirada. Faça login novamente.",
            "warning"
          );
        } else {
          snackbarStore.showSnackbar("Logout realizado!", "success");
        }
      }
    },

    setToken(token: string | null) {
      this.token = token;

      if (token) {
        localStorage.setItem("@system_plug_juridico.access_token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        localStorage.removeItem("@system_plug_juridico.access_token");
        delete axios.defaults.headers.common["Authorization"];
      }
    },

    setUser(user: DataUser | null) {
      this.user = user;
    },
  },
});
