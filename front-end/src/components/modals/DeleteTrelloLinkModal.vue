<template>
  <v-dialog v-model="dialog" max-width="420">
    <v-card>
      <div
        style="
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        "
      >
        <v-card-title class="text-h6">Remover link do Trello?</v-card-title>
      </div>

      <v-card-text>
        Tem certeza que deseja remover este link do Trello associado ao serviço?
      </v-card-text>

      <v-divider class="mb-4" />

      <v-card-actions class="d-flex justify-end ga-4">
        <v-btn
          style="background-color: #dc143c; color: white; font-weight: bold"
          @click="confirmDelete"
        >
          Excluir
        </v-btn>

        <v-btn
          style="background-color: grey; color: white; font-weight: bold"
          @click="dialog = false"
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTrelloLinksStore } from "@/stores/trello-links/TrelloLinkStore";
import { useSnackbarStore } from "@/stores/snackbarStore";

const props = defineProps<{
  modelValue: boolean;
  trelloId: string | null;
}>();

const emit = defineEmits(["update:modelValue", "deleted"]);

const trelloStore = useTrelloLinksStore();
const snackbarStore = useSnackbarStore();

const dialog = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

async function confirmDelete() {
  if (!props.trelloId) return;

  try {
    await trelloStore.remove(props.trelloId);
    snackbarStore.showSnackbar("Link do Trello removido!", "success");

    emit("deleted", props.trelloId);
  } catch (err) {
    snackbarStore.showSnackbar("Erro ao remover link!", "error");
  } finally {
    dialog.value = false;
  }
}
</script>
