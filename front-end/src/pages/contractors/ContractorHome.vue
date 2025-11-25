<template>
  <v-container class="pt-11">
    <!-- CARDS -->
    <ContractorActiveAndInative />

    <!-- BUSCA -->
    <v-row class="mt-4">
      <v-col cols="12">
        <ContractorSearch v-model:search="search" v-model:status="status" />
      </v-col>
    </v-row>

    <!-- LISTAGEM DE CLIENTES -->
    <v-row dense class="ga-6 mt-4">
      <v-col
        v-for="contractor in filteredContractors"
        :key="contractor.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="pa-4" elevation="2" color="cardBackground">
          <div class="d-flex justify-space-between align-center mb-3">
            <div class="d-flex flex-column ga-1">
              <h3 class="text-h6 font-weight-bold ma-0">
                {{ contractor.name }}
              </h3>

              <div class="d-flex flex-column pt-6">
                <div class="d-flex flex-column ga-4">
                  <span class="text-grey-darken-1">
                    <b>CNPJ:</b>
                    {{ formatCnpj(contractor.cnpj) || "Não possui" }}
                  </span>
                  <span class="text-grey-darken-1">
                    <b>CPF:</b> {{ formatCpf(contractor.cpf) || "Não possui" }}
                  </span>
                </div>
              </div>
            </div>

            <v-icon :color="contractor.is_active ? 'green' : 'red'" size="18">
              mdi-circle
            </v-icon>
          </div>

          <v-divider />

          <div class="d-flex flex-column mt-3 ga-4 pt-2 pb-2">
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon size="20">mdi-phone</v-icon>
              <span>{{ formatPhone(contractor.phone_commercial) }}</span>
            </div>

            <div class="d-flex align-center ga-2 mb-2">
              <v-icon size="20">mdi-email-outline</v-icon>
              <span>{{ contractor.email }}</span>
            </div>
          </div>

          <v-divider />

          <!-- AÇÕES -->
          <div class="d-flex justify-space-around align-center flex-wrap pt-4">
            <div
              v-for="action in actions"
              :key="action.label"
              class="text-center"
              style="cursor: pointer"
              @click="handleActionClick(action.label, contractor)"
            >
              <v-icon size="20" class="mb-1">{{ action.icon }}</v-icon>
              <div style="font-size: 14px">{{ action.label }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- LOADING -->
    <div v-if="contractorStore.loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" size="60" />
    </div>

    <!-- MODAL CONTRATO -->
    <v-dialog v-model="showModalDetailsContract" max-width="1200">
      <ContractDetails
        v-if="selectedContract"
        :contract="selectedContract"
        @close="showModalDetailsContract = false"
      />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ContractorActiveAndInative from "@/components/contractors/ContractorActiveAndInative.vue";
import ContractorSearch from "@/components/contractors/ContractorSearch.vue";
import { useContractorStore } from "@/stores/contractors/ContractorStore";
import { useContractStore } from "@/stores/contracts/ContractStore";
import { formatCpf, formatCnpj, formatPhone } from "@/filters";
import ContractDetails from "../contracts/ContractDetails.vue";
import type { DataContractor } from "@/types/contractors/ContractorTypes";
import type { DataContract } from "@/types/contracts/ContractTypes";

const contractorStore = useContractorStore();
const contractStore = useContractStore();

const search = ref("");
const status = ref(null);

const showModalDetailsContract = ref(false);
const selectedContract = ref<DataContract | null>(null);

onMounted(async () => {
  await contractorStore.findAll();
});

const filteredContractors = computed(() => {
  const term = (search.value || "").toLowerCase();

  return contractorStore.contractors.filter((c) => {
    const matchStatus =
      status.value === null ? true : c.is_active === status.value;

    const matchSearch = [
      c.name,
      c.email,
      c.phone_commercial,
      c.phone_personal,
      c.cnpj,
      c.cpf,
    ]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(term));

    return matchStatus && matchSearch;
  });
});

const actions = [
  { label: "Contrato", icon: "mdi-file-sign" },
  { label: "Instrução Processo", icon: "mdi-card-account-phone-outline" },
  { label: "Requerente", icon: "mdi-account-outline" },
  { label: "Serviço", icon: "mdi-handshake-outline" },
  { label: "Trello", icon: "mdi-trello" },
];

async function handleActionClick(label: string, contractor: DataContractor) {
  if (label === "Contrato") {
    await openContract(contractor.id);
  }
}

async function openContract(contractorId: string) {
  const contract = await contractStore.findByContractor(contractorId);

  selectedContract.value = contract;
  showModalDetailsContract.value = true;
}
</script>
