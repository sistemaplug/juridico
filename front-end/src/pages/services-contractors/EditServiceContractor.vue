<template>
  <v-row>
    <v-col>
      <v-text-field
        v-model="localService.type"
        label="Tipo do Serviço"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-select
        v-model="localService.status"
        :items="statusOptions"
        item-title="title"
        item-value="value"
        label="Status"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-select
        v-model="localService.is_active"
        :items="activeOptions"
        item-title="title"
        item-value="value"
        label="Situação"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <!-- Botões -->
  <div class="d-flex justify-end ga-4">
    <v-btn color="error" @click="emit('close')">
      <v-icon start>mdi-arrow-left</v-icon>
      Cancelar
    </v-btn>

    <v-btn color="primary" @click="updateData">
      <v-icon start>mdi-content-save</v-icon>
      Salvar Registro
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { DataService } from "@/types/services-contractors/ServiceContractorTypes";
import { useServiceContractorStore } from "@/stores/services-contractors/ServiceContractorStore";
import { useSnackbarStore } from "@/stores/snackbarStore";

const props = defineProps<{ service: DataService }>();
const emit = defineEmits(["close"]);

const serviceStore = useServiceContractorStore();
const snackbarStore = useSnackbarStore();

// cópia editável sem mutar props
const localService = ref<DataService>({
  ...props.service,
});

// opções do STATUS
const statusOptions = [
  { title: "Pendente", value: "PENDING" },
  { title: "Em andamento", value: "IN_PROGRESS" },
  { title: "Concluído", value: "COMPLETED" },
  { title: "Cancelado", value: "CANCELED" },
];

// opções de SITUAÇÃO
const activeOptions = [
  { title: "Ativo", value: true },
  { title: "Inativo", value: false },
];

async function updateData() {
  try {
    const payload = {
      type: localService.value.type,
      status: localService.value.status,
      is_active: localService.value.is_active,
    };

    await serviceStore.update(localService.value.id, payload);
    snackbarStore.showSnackbar("Registro atualizado!", "success");

    emit("close");
  } catch (error) {
    snackbarStore.showSnackbar("Erro ao atualizar serviço!", "error");
  }
}
</script>
