<template>
  <v-row>
    <v-col>
      <v-text-field
        :model-value="formattedDate"
        label="Data | Contratação"
        variant="outlined"
        density="compact"
        readonly
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="contract.contract_object"
        label="Objeto do Contrato"
        variant="outlined"
        density="compact"
        readonly
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="contract.service_type"
        label="Serviço"
        variant="outlined"
        density="compact"
        readonly
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="contract.channel"
        label="Canal"
        variant="outlined"
        density="compact"
        readonly
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="contract.class"
        label="Classe"
        variant="outlined"
        density="compact"
        readonly
      />
    </v-col>
    <v-col>
      <v-text-field
        v-model="formattedFrequency"
        label="Frequência"
        variant="outlined"
        density="compact"
        readonly
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="contract.power"
        label="Potência"
        variant="outlined"
        density="compact"
        readonly
      />
    </v-col>
  </v-row>


</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatDate, formatFrequency } from "@/filters";
import type { DataContract } from "@/types/contracts/ContractTypes";

const props = defineProps<{ contract: DataContract }>();

// Formatação da Data
const formattedDate = computed(() => formatDate(props.contract.contract_date));

// Formatação da Frequência
const formattedFrequency = computed(() => {
return  formatFrequency(props.contract.frequency);
});
</script>
