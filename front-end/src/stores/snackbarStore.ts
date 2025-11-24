import { defineStore } from "pinia";
import { ref } from "vue";
export const useSnackbarStore = defineStore("snackbar", () => {
  const visible = ref(false);
  const text = ref("");
  const status = ref("");
  function showSnackbar(newText: string, newStatus: string) {
    text.value = newText;
    status.value = newStatus;
    visible.value = true;
    setTimeout(
      () => {
        visible.value = false;
      },
      newStatus === "error" ? 5000 : 3000
    );
  }

  function clearSnackbar() {
    visible.value = false;
    text.value = "";
    status.value = "";
  }
  return { visible, text, status, showSnackbar, clearSnackbar };
});
