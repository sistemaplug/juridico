<template>
  <v-container fluid class="pa-0">
    <v-row class="ma-0 pa-0 ga-4" no-gutters>
      <v-col v-for="(card, index) in contractorCards" :key="index">
        <v-card
          class="px-6 py-4 d-flex align-center justify-space-between"
          height="110"
          elevation="0"
          color="cardBackground"
          style="border: 1px solid #ddd; border-radius: 8px"
        >
          <!-- Ícone -->
          <v-icon size="48">{{ card.icon }}</v-icon>

          <!-- Conteúdo -->
          <div class="text-end">
            <div class="text-h4 font-weight-bold">{{ card.value }}</div>
            <div class="text-body-1">{{ card.label }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useContractorStore } from "@/stores/contractors/ContractorStore";
import { ref, onMounted, computed } from "vue";

const totalContractors = ref(0);
const totalContractorsActive = ref(0);
const totalContractorsInactive = ref(0);

const contractorStore = useContractorStore();

async function loadContractorCounts() {
  // Total geral
  await contractorStore.findAll();
  totalContractors.value = contractorStore.contractors.length;

  // Total ativos
  await contractorStore.active();
  totalContractorsActive.value = contractorStore.contractors.length;

  // Total inativos
  await contractorStore.inactive();
  totalContractorsInactive.value = contractorStore.contractors.length;

  // Recarrega lista principal (todos)
  // para que o ContractorHome continue exibindo todos normalmente
  await contractorStore.findAll();
}

onMounted(() => {
  loadContractorCounts();
});

const contractorCards = computed(() => [
  {
    icon: "mdi-account-group",
    label: "Total de Clientes",
    value: totalContractors.value,
  },
  {
    icon: "mdi-account-multiple-check",
    label: "Total de clientes Ativos",
    value: totalContractorsActive.value,
  },
  {
    icon: "mdi-account-off",
    label: "Total de clientes Inativos",
    value: totalContractorsInactive.value,
  },
]);
</script>
