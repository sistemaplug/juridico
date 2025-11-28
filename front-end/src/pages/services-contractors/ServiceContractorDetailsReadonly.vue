<template>
  <!-- Quando não existe serviço -->
  <v-alert
    v-if="!service"
    type="info"
    text="Nenhum serviço cadastrado para este cliente!"
    variant="tonal"
    class="mt-4"
  />

  <!-- Quando existe -->
  <template v-else>
    <v-row>
      <v-col>
        <v-text-field
          :model-value="service.type"
          label="Tipo do Serviço"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>

      <v-col>
        <v-text-field
          :model-value="statusLabel"
          label="Status"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select
          :model-value="service.is_active ? 'Ativo' : 'Inativo'"
          label="Situação"
          items-text="title"
          items-value="value"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>
  </template>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { DataService } from "@/types/services-contractors/ServiceContractorTypes";

const props = defineProps<{ service: DataService | null }>();

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em andamento",
    COMPLETED: "Concluído",
    CANCELED: "Cancelado",
  };
  return props.service ? map[props.service.status] : "";
});
</script>
