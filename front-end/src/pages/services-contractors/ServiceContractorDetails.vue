<template>
  <v-card class="pa-5">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-card-title>Detalhes do Serviço</v-card-title>
      <v-icon class="cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
    </div>

    <v-divider class="mb-4" />

    <!-- NENHUM CONTATO -->
    <v-alert
      v-if="!service"
      type="info"
      text="Nenhum serviço cadastrado para este cliente!"
      variant="tonal"
      class="mt-4"
    />

    <!-- MODO VISUALIZAÇÃO -->
    <ServiceContractorDetailsReadonly
      v-if="service && !isEditing"
      :service="service"
      @edit="isEditing = true"
      @close="emit('close')"
    />

    <!--  MODO EDIÇÃO -->
    <EditServiceContractor
      v-if="service && isEditing"
      :service="service"
      @close="emit('close')"
    />

    <!-- BOTÃO EDITAR -->
    <div class="d-flex justify-end pt-6" v-if="service && !isEditing">
      <v-btn color="primary" @click="isEditing = true">
        <v-icon start>mdi-pencil</v-icon>
        Editar Registro
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ServiceContractorDetailsReadonly from "./ServiceContractorDetailsReadonly.vue";
import EditServiceContractor from "./EditServiceContractor.vue";
import type { DataService } from "@/types/services-contractors/ServiceContractorTypes";

const emit = defineEmits(["close"]);

// recebe "service" (como o Contract usa "service")
const props = defineProps<{
  service: DataService | null;
}>();

// estado de edição
const isEditing = ref(false);

// cópia local dos dados
const service = ref<DataService | null>(
  props.service ? { ...props.service } : null
);
</script>
