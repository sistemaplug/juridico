<template>
  <v-card class="pa-5">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-card-title>Detalhes do Contato | Instrução do Processo</v-card-title>
      <v-icon class="cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
    </div>

    <v-divider class="mb-4" />

    <!-- NENHUM CONTATO -->
    <v-alert
      v-if="!contact"
      type="info"
      variant="tonal"
      border="start"
      elevation="2"
      class="mt-4"
    >
      Nenhum contato cadastrado para este cliente!
    </v-alert>

    <!-- MODO VISUALIZAÇÃO -->
    <ProcessContactDetailsReadonly
      v-if="contact && !isEditing"
      :contact="contact"
      @edit="isEditing = true"
      @close="emit('close')"
    />

    <!--  MODO EDIÇÃO -->
    <EditProcessContact
      v-if="contact && isEditing"
      :contact="contact"
      @close="emit('close')"
    />

    <!-- BOTÃO EDITAR -->
    <div class="d-flex justify-end pt-6" v-if="contact && !isEditing">
      <v-btn color="primary" @click="isEditing = true">
        <v-icon start>mdi-pencil</v-icon>
        Editar Registro
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { DataProcessContact } from "@/types/process-contacts/ProcessContactTypes";

import ProcessContactDetailsReadonly from "./ProcessContactDetailsReadonly.vue";
import EditProcessContact from "./EditProcessContact.vue";

const emit = defineEmits(["close"]);

// recebe "contact" (como o Contract usa "contract")
const props = defineProps<{
  contact: DataProcessContact | null;
}>();

// estado de edição
const isEditing = ref(false);

// cópia local dos dados
const contact = ref<DataProcessContact | null>(
  props.contact ? { ...props.contact } : null
);
</script>
