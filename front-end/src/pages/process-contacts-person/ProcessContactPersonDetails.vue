<template>
  <v-card class="pa-5">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-card-title>Detalhes do Contato | Instrução do Processo</v-card-title>
      <v-icon class="cursor-pointer" @click="closeModal">mdi-close</v-icon>
    </div>

    <v-divider class="mb-4" />

    <!-- NENHUM CONTATO -->
    <v-alert
      v-if="!props.contact"
      type="info"
      text="Nenhum contato cadastrado para este cliente!"
      variant="tonal"
      class="mt-4"
    />

    <!-- MODO VISUALIZAÇÃO -->
    <ProcessContactDetailsReadonly
      v-if="props.contact && !isEditing"
      :contact="props.contact"
      @edit="isEditing = true"
      @close="closeModal"
    />

    <!-- MODO EDIÇÃO -->
    <EditProcessContact
      v-if="props.contact && isEditing"
      :contact="props.contact"
      @close="closeAndReset"
    />

    <!-- BOTÃO EDITAR -->
    <div class="d-flex justify-end pt-6" v-if="props.contact && !isEditing">
      <v-btn color="primary" @click="isEditing = true">
        <v-icon start>mdi-pencil</v-icon>
        Editar Registro
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { DataProcessContactPerson } from "@/types/process-contacts-person/ProcessContactPersonTypes";

import ProcessContactDetailsReadonly from "./ProcessContactPersonDetailsReadonly.vue";
import EditProcessContact from "./EditProcessContactPerson.vue";

// Emite evento para o componente pai (para fechar modal ou drawer)
const emit = defineEmits(["close"]);

const props = defineProps<{
  contact: DataProcessContactPerson | null;
}>();

const isEditing = ref(false);

// cópia local
const contact = ref<DataProcessContactPerson | null>(
  props.contact ? { ...props.contact } : null
);

// Fecha modal sem resetar dados
function closeModal() {
  emit("close");
}

// Fecha modal E reseta o modo de edição
function closeAndReset() {
  isEditing.value = false;
  emit("close");
}
</script>
