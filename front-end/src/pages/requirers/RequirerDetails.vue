<template>
  <v-card class="pa-5">
    <div class="d-flex justify-space-between align-center mb-4">
      <v-card-title>Detalhes do Requerente</v-card-title>
      <v-icon class="cursor-pointer" @click="$emit('close')">mdi-close</v-icon>
    </div>

    <v-divider class="mb-4" />

    <!-- NENHUM CONTATO -->
    <v-alert
      v-if="!requirer"
      type="info"
      text="Nenhum requerente cadastrado para este cliente!"
      variant="tonal"
      class="mt-4"
    />

    <!-- MODO VISUALIZAÇÃO -->
    <RequirerDetailsReadonly
      v-if="requirer && !isEditing"
      :requirer="requirer"
      @edit="isEditing = true"
      @close="emit('close')"
    />

    <!--  MODO EDIÇÃO -->
    <EditRequirer
      v-if="requirer && isEditing"
      :requirer="requirer"
      @close="emit('close')"
    />

    <!-- BOTÃO EDITAR -->
    <div class="d-flex justify-end pt-6" v-if="requirer && !isEditing">
      <v-btn color="primary" @click="isEditing = true">
        <v-icon start>mdi-pencil</v-icon>
        Editar Registro
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { DataRequirer } from "@/types/requirers/RequirerTypes";
import RequirerDetailsReadonly from "./RequirerDetailsReadonly.vue";
import EditRequirer from "./EditRequirer.vue";

const emit = defineEmits(["close"]);

// recebe "requirer" (como o Contract usa "requirer")
const props = defineProps<{
  requirer: DataRequirer | null;
}>();

// estado de edição
const isEditing = ref(false);

// cópia local dos dados
const requirer = ref<DataRequirer | null>(
  props.requirer ? { ...props.requirer } : null
);
</script>
