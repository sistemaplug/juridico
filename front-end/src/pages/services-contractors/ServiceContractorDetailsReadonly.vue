<template>
  <!-- Quando não existe serviço -->
  <v-alert
    v-if="!safeService"
    type="info"
    text="Nenhum serviço cadastrado para este cliente!"
    variant="tonal"
    class="mt-4"
  />

  <!-- Quando existe -->
  <template v-else>
    <!-- DADOS DO SERVIÇO -->
    <v-row>
      <v-col>
        <v-text-field
          :model-value="safeService.type"
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
        <v-text-field
          :model-value="safeService.is_active ? 'Ativo' : 'Inativo'"
          label="Situação"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <!-- LISTA DE LINKS DO TRELLO -->
    <v-card-title class="text-h6 mt-6 mb-2">Links do Trello</v-card-title>

    <div v-if="safeService.trello_links.length === 0">
      <v-alert
        type="warning"
        text="Nenhum link do Trello cadastrado."
        variant="tonal"
      />
    </div>

    <v-row v-for="link in safeService.trello_links" :key="link.id" class="mb-3">
      <v-col>
        <v-card elevation="1" class="pa-4">
          <div class="text-body-1 mb-1">
            <strong>Observação:</strong> {{ link.observation }}
          </div>

          <div class="text-caption text-blue">
            {{ link.url }}
          </div>

          <div class="d-flex justify-end mt-3">
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-open-in-new"
              :href="link.url"
              target="_blank"
            >
              Abrir Trello
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DataService } from "@/types/services-contractors/ServiceContractorTypes";

const props = defineProps<{ service: DataService | null }>();

// Proteção similar ao RequirerDetails
const safeService = computed(() => props.service ?? null);

// status amigável
const statusLabel = computed(() => {
  const map: Record<string, string> = {
    PENDING: "Pendente",
    IN_PROGRESS: "Em andamento",
    COMPLETED: "Concluído",
    CANCELED: "Cancelado",
  };
  return safeService.value ? map[safeService.value.status] : "";
});

// Links do Trello
const trelloLinks = computed(() => safeService.value?.trello_links ?? []);

// Abrir o trello em nova aba
function openTrello(url: string) {
  window.open(url, "_blank");
}
</script>
