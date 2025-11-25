<template>
  <!-- Nome / CPF-CNPJ -->
  <v-row class="pt-6">
    <v-col>
      <v-text-field
        v-model="form.name"
        label="Nome | Razão Social"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="documentInput"
        label="CPF | CNPJ"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <!-- Telefones -->
  <v-row>
    <v-col>
      <v-text-field
        v-model="phoneCommercialInput"
        label="Fone | Comercial"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="phonePersonalInput"
        label="Fone | Pessoal"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <!-- Email -->
  <v-row>
    <v-col>
      <v-text-field
        v-model="form.email"
        label="E-mail"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-divider class="mb-4" />
  <!-- Endereço Comercial -->
  <div class="pb-4">
    <v-card-title>Endereço Comercial:</v-card-title>
  </div>

  <v-row>
    <v-col cols="4">
      <v-text-field
        v-model="commercialZip"
        label="CEP"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="form.commercial_address.street"
        label="Rua"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.commercial_address.number"
        label="Número"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="form.commercial_address.neighborhood"
        label="Bairro"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.commercial_address.complement"
        label="Complemento"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="cityStateCommercial"
        label="Cidade/Estado"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-divider class="mb-4" />
  <!-- Endereço Residencial -->
  <div class="pb-4">
    <v-card-title>Endereço Residencial</v-card-title>
  </div>
  <v-row>
    <v-col cols="4">
      <v-text-field
        v-model="residentialZip"
        label="CEP"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="form.residential_address.street"
        label="Rua"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.residential_address.number"
        label="Número"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="form.residential_address.neighborhood"
        label="Bairro"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.residential_address.complement"
        label="Complemento"
        variant="outlined"
        density="compact"
      />
    </v-col>
    
    <v-col>
      <v-text-field
        v-model="cityStateResidential"
        label="Cidade/Estado"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <!-- Botão salvar -->
  <v-btn color="primary" class="mt-4" @click="updateData">
    <v-icon start>mdi-content-save</v-icon>
    Salvar Registro
  </v-btn>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useProcessContactStore } from "@/stores/process-contacts/ProcessContactStore";
import { useSnackbarStore } from "@/stores/snackbarStore";

import {
  formatCpf,
  formatCnpj,
  cleanPhone,
  formatPhone,
  formatZipcode,
} from "@/filters";

import { searchZipCode } from "@/utils/searchZipCode";
import type { DataProcessContact } from "@/types/process-contacts/ProcessContactTypes";
import { useAddressStore } from "@/stores/addresses/AddressStore";
import { STATES } from "@/assets/states";

const props = defineProps<{ contact: DataProcessContact }>();
const emit = defineEmits(["close"]);

const processContactStore = useProcessContactStore();
const addressStore = useAddressStore();
const snackbarStore = useSnackbarStore();

// Cópia local editável (não muta a prop original)
const form = ref(JSON.parse(JSON.stringify(props.contact)));

// CPF / CNPJ MASK DINÂMICA
const documentInput = computed({
  get() {
    if (form.value.cpf) return formatCpf(form.value.cpf);
    if (form.value.cnpj) return formatCnpj(form.value.cnpj);
    return "";
  },
  set(value: string) {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 11) {
      form.value.cpf = digits;
      form.value.cnpj = "";
    } else {
      form.value.cpf = "";
      form.value.cnpj = digits;
    }
  },
});

// PHONE MASKS
const phoneCommercialInput = computed({
  get: () => formatPhone(form.value.phone_commercial ?? ""),
  set: (value: string) =>
    (form.value.phone_commercial = cleanPhone(value || "")),
});

const phonePersonalInput = computed({
  get: () => formatPhone(form.value.phone_personal ?? ""),
  set: (value: string) => (form.value.phone_personal = cleanPhone(value || "")),
});

// CEP MASK DINÂMICA COMERCIAL
const commercialZip = computed({
  get() {
    return formatZipcode(form.value.commercial_address.zipcode);
  },
  set(value: string) {
    form.value.commercial_address.zipcode = value
      .replace(/\D/g, "")
      .slice(0, 8);
  },
});

// CEP MASK DINÂMICA RESIDENCIAL
const residentialZip = computed({
  get() {
    return formatZipcode(form.value.residential_address.zipcode);
  },
  set(value: string) {
    form.value.residential_address.zipcode = value
      .replace(/\D/g, "")
      .slice(0, 8);
  },
});

// CEP AUTO-COMPLETE — Comercial
watch(
  () => form.value.commercial_address.zipcode,
  async (value) => {
    const cep = value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    const result = await searchZipCode(cep);
    if (result) {
      form.value.commercial_address.street = result.logradouro;
      form.value.commercial_address.neighborhood = result.bairro;
      form.value.commercial_address.city = result.cidade;
      form.value.commercial_address.state = result.estado;
      form.value.commercial_address.complement = result.complemento ?? "";
    }
  }
);

// CEP AUTO-COMPLETE — Residencial
watch(
  () => form.value.residential_address.zipcode,
  async (value) => {
    const cep = value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    const result = await searchZipCode(cep);
    if (result) {
      form.value.residential_address.street = result.logradouro;
      form.value.residential_address.neighborhood = result.bairro;
      form.value.residential_address.city = result.cidade;
      form.value.residential_address.state = result.estado;
      form.value.residential_address.complement = result.complemento ?? "";
    }
  }
);

// Formatação de Cidade e Estado Comercial
const cityStateCommercial = computed(() => {
  return `${form.value.commercial_address.city}, ${
    STATES[form.value.commercial_address.state] ||
    form.value.commercial_address.state
  }`;
});

// Formatação de Cidade e Estado Residencial
const cityStateResidential = computed(() => {
  return `${form.value.residential_address.city}, ${
    STATES[form.value.residential_address.state] ||
    form.value.residential_address.state
  }`;
});

async function updateData() {
  try {
    // Atualizar o ProcessContact
    const processPayload = {
      name: form.value.name,
      cpf: form.value.cpf || null,
      cnpj: form.value.cnpj || null,
      email: form.value.email,
      phone_commercial: cleanPhone(form.value.phone_commercial),
      phone_personal: cleanPhone(form.value.phone_personal),
    };

    await processContactStore.update(form.value.id, processPayload);

    // Atualizar endereço comercial
    const commercialPayload = {
      zipcode: form.value.commercial_address.zipcode.replace(/\D/g, ""),
      street: form.value.commercial_address.street,
      number: form.value.commercial_address.number,
      neighborhood: form.value.commercial_address.neighborhood,
      complement: form.value.commercial_address.complement,
      city: form.value.commercial_address.city,
      state: form.value.commercial_address.state,
    };

    await addressStore.update(
      form.value.commercial_address.id,
      commercialPayload
    );

    // Atualizar endereço residencial
    const residentialPayload = {
      zipcode: form.value.residential_address.zipcode.replace(/\D/g, ""),
      street: form.value.residential_address.street,
      number: form.value.residential_address.number,
      neighborhood: form.value.residential_address.neighborhood,
      complement: form.value.residential_address.complement,
      city: form.value.residential_address.city,
      state: form.value.residential_address.state,
    };

    await addressStore.update(
      form.value.residential_address.id,
      residentialPayload
    );

    snackbarStore.showSnackbar("Registro atualizado!", "success");
    emit("close");
  } catch (error) {
    console.error(error);
    snackbarStore.showSnackbar("Erro ao atualizar contato!", "error");
  }
}
</script>
