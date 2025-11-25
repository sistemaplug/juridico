<template>
  <v-card class="pa-5">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-card-title>Detalhes do Contrato</v-card-title>
      <v-icon @click="$emit('close')" class="cursor-pointer">mdi-close</v-icon>
    </div>

    <v-divider class="mb-4" />

    <!-- MODO VISUALIZAÇÃO -->
    <ContractDetailsReadonly
      v-if="!isEditing"
      :contract="contract"
      @edit="isEditing = true"
      @close="emit('close')"
    />

    <!-- MODO EDIÇÃO -->
    <EditContract v-else :contract="contract" @close="emit('close')" />

    <!-- BOTÃO ÚNICO DE AÇÃO -->
    <div class="d-flex justify-end pt-6" v-if="!isEditing">
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
const props = defineProps<{ contract: DataContract }>();

// estado editável
const isEditing = ref(false);

// cópia local do contrato
const contract = ref<DataContract>({ ...props.contract });

// callback após salvar
function finishEditing(updatedData: DataContract) {
  contract.value = updatedData;
  isEditing.value = false;
}
</script>
