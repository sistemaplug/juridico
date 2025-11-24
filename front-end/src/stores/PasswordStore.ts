import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";

export const usePasswordStore = defineStore("password", () => {
  const loading = ref(false);

  async function updatePassword(id: string, newPassword: string) {
    loading.value = true;
    try {
      await API.passwordService.update(id, { new_password: newPassword });
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function generatePassword(id: string) {
    loading.value = true;
    try {
      return await API.passwordService.generate(id);
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return { loading, updatePassword, generatePassword };
});
