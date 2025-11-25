<template>
  <v-card class="pa-5">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-card-title>Detalhes do Contrato</v-card-title>
      <v-icon @click="$emit('close')" class="cursor-pointer">mdi-close</v-icon>
    </div>

    <v-divider class="mb-4" />

    <!-- NÃO TEM CONTRATO -->
    <v-alert
      v-if="!contract"
      type="info"
      text="Nenhum contrato cadastrado para este cliente!"
      variant="tonal"
      class="mt-4"
    />

    <!-- MODO VISUALIZAÇÃO -->
    <ContractDetailsReadonly
      v-if="contract && !isEditing"
      :contract="contract"
      @edit="isEditing = true"
      @close="emit('close')"
    />

    <!-- MODO EDIÇÃO -->
    <EditContract
      v-if="contract && isEditing"
      :contract="contract"
      @close="emit('close')"
    />

    <!-- BOTÃO EDITAR -->
    <div class="d-flex justify-end pt-6" v-if="contract && !isEditing">
      <v-btn color="primary" @click="isEditing = true">
        <v-icon start>mdi-pencil</v-icon>
        Editar Registro
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { DataContract } from "@/types/contracts/ContractTypes";

import ContractDetailsReadonly from "./ContractDetailsReadonly.vue";
import EditContract from "./EditContract.vue";

const emit = defineEmits(["close"]);
const props = defineProps<{ contract: DataContract | null }>();

const isEditing = ref(false);

const contract = ref<DataContract | null>(
  props.contract ? { ...props.contract } : null
);
</script>
