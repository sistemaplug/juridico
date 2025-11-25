<template>
  <v-row class="pt-6">
    <v-col>
      <v-menu
        v-model="showDatePicker"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template #activator="{ props }">
          <v-text-field
            v-bind="props"
            :model-value="selectedDateFormatted"
            label="Data | Contratação"
            variant="outlined"
            density="compact"
          />
        </template>
        <v-date-picker
          v-model="selectedDatePicker"
          color="primary"
          title="Escolher Data"
          @update:model-value="onDateSelected"
        />
      </v-menu>
    </v-col>

    <v-col>
      <v-text-field
        v-model="contract.contract_object"
        label="Objeto do Contrato"
        variant="outlined"
        density="compact"
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
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="contract.channel"
        label="Canal"
        variant="outlined"
        density="compact"
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
      />
    </v-col>
    <v-col>
      <v-text-field
        v-model="formattedFrequency"
        label="Frequência"
        variant="outlined"
        density="compact"
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
      />
    </v-col>
  </v-row>

  <v-btn color="primary" class="mt-4" @click="updateData">
    <v-icon start>mdi-content-save</v-icon>
    Salvar Registro
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { DataContract } from "@/types/contracts/ContractTypes";
import { useContractStore } from "@/stores/contracts/ContractStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { formatFrequency, useDatePickerField } from "@/filters";

const props = defineProps<{ contract: DataContract }>();
const emit = defineEmits(["close"]);

const contract = ref({ ...props.contract });
const contractStore = useContractStore();
const snackbarStore = useSnackbarStore();

const showDatePicker = ref(false);

// Inicializa com a data do banco ajustada para o fuso local
const startDate = new Date(
  new Date(contract.value.contract_date).getTime() +
    new Date(contract.value.contract_date).getTimezoneOffset() * 60000
);

const selected = ref({ date: startDate.toISOString() });

// Usa o seu helper normalmente
const {
  pickerValue: selectedDatePicker,
  formattedValue: selectedDateFormatted,
} = useDatePickerField(selected, "date");

// Quando o usuário seleciona nova data
function onDateSelected(val: Date) {
  const localDate = new Date(val.getTime() - val.getTimezoneOffset() * 60000);
  contract.value.contract_date = localDate.toISOString(); // salva ISO UTC
  selected.value.date = localDate.toISOString(); // atualiza campo
  showDatePicker.value = false;
}

// Formatação da frequência
const formattedFrequency = computed({
  get() {
    return formatFrequency(contract.value.frequency || "");
  },
  set(value: string) {
    const cleaned = value.replace(/\D/g, ""); // só números
    contract.value.frequency = cleaned; // guarda sem máscara
  },
});

async function updateData() {
  try {
    const payload = {
      contract_date: contract.value.contract_date,
      contract_object: contract.value.contract_object,
      service_type: contract.value.service_type,
      channel: contract.value.channel,
      class: contract.value.class,
      frequency: contract.value.frequency,
      power: contract.value.power,
    };
    await contractStore.update(contract.value.id, payload);
    snackbarStore.showSnackbar("Registro atualizado!", "success");
    emit("close");
  } catch (error) {
    snackbarStore.showSnackbar("Erro ao atualizar serviço!", "error");
  }
}
</script>
