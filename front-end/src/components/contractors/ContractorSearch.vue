<template>
  <v-row no-gutters class="align-center ga-4">
    <v-col>
      <v-text-field
        v-model="localSearch"
        label="Pesquisar por nome, CPF, CNPJ, telefone ou email"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        clearable
        @input="emitSearch"
      />
    </v-col>

    <v-col cols="12" md="1">
      <v-select
        v-model="localStatus"
        :items="statusOptions"
        label="Status"
        item-title="label"
        item-value="value"
        variant="outlined"
        density="compact"
        clearable
        @update:model-value="emitStatus"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  search: String,
  status: null,
});

const emit = defineEmits(["update:search", "update:status"]);

const localSearch = ref(props.search || "");
const localStatus = ref(props.status);

// opções do select
const statusOptions = [
  { label: "Todos", value: null },
  { label: "Ativos", value: true },
  { label: "Inativos", value: false },
];

function emitSearch() {
  emit("update:search", localSearch.value);
}

function emitStatus() {
  emit("update:status", localStatus.value);
}

// sincronizar com o pai
watch(
  () => props.search,
  (val) => {
    localSearch.value = val ?? ""; // garante sempre string
  }
);

watch(
  () => props.status,
  (val) => (localStatus.value = val)
);
</script>
