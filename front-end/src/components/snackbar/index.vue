<template>
  <v-snackbar
    :model-value="visible"
    location="bottom left"
    :timeout="timeout"
    @update:model-value="updateVisible"
  >
    <div v-if="status === 'error'" class="d-flex align-center">
      <v-icon color="red">mdi-close-circle</v-icon>
      <span class="pl-2">{{ text }}</span>
    </div>
    <div v-else-if="status === 'success'" class="d-flex align-center">
      <v-icon color="green">mdi-check-circle</v-icon>
      <span class="pl-2">{{ text }}</span>
    </div>
    <div v-else-if="status === 'loading'" class="d-flex align-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <span class="pl-2">{{ text }}</span>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from "@/stores/snackbarStore";

const snackbarStore = useSnackbarStore();
const visible = computed(() => snackbarStore.visible);
const status = computed(() => snackbarStore.status);
const text = computed(() => snackbarStore.text);

const timeout = computed(() => {
  if (status.value === "error") return 5000;
  if (status.value === "success") return 3000;
  return 15000;
});

function updateVisible(value: boolean) {
  snackbarStore.visible = value;
}
</script>
