<template>
  <!-- Nome / CPF-CNPJ -->
  <v-row class="pt-6">
    <v-col>
      <v-text-field
        v-model="form.person.name"
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
        v-model="form.person.email"
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
        v-model="form.person.commercial_address.street"
        label="Rua"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.person.commercial_address.number"
        label="Número"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="form.person.commercial_address.neighborhood"
        label="Bairro"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.person.commercial_address.complement"
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
    <v-card-title>Endereço Residencial:</v-card-title>
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
        v-model="form.person.residential_address.street"
        label="Rua"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.person.residential_address.number"
        label="Número"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="form.person.residential_address.neighborhood"
        label="Bairro"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.person.residential_address.complement"
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
  <div class="d-flex ga-4 align-center justify-end">
    <v-btn @click="$emit('close')" color="error">
      <v-icon start>mdi-arrow-left</v-icon>
      Cancelar
    </v-btn>

    <v-btn color="primary" @click="updateData">
      <v-icon start>mdi-content-save</v-icon>
      Salvar Registro
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useSnackbarStore } from "@/stores/snackbarStore";
import {
  formatCpf,
  formatCnpj,
  cleanPhone,
  formatPhone,
  formatZipcode,
  formatPhoneSmart,
  cleanPhoneStrict,
  formatCpfSmart,
  formatCnpjSmart,
  cleanCpfStrict,
  cleanCnpjStrict,
  formatCepSmart,
  cleanCepStrict,
} from "@/filters";
import type { DataProcessContactPerson } from "@/types/process-contacts-person/ProcessContactPersonTypes";
import { searchZipCode } from "@/utils/searchZipCode";
import { useAddressStore } from "@/stores/addresses/AddressStore";
import { STATES } from "@/assets/states";
import { useProcessContactPersonStore } from "@/stores/process-contacts/ProcessContactPersonStore";
import { usePersonStore } from "@/stores/persons/PersonStore";
import type { DataAddress } from "@/types/addresses/AddressTypes";
import { useContractorStore } from "@/stores/contractors/ContractorStore";

const props = defineProps<{ contact: DataProcessContactPerson }>();
const emit = defineEmits(["close"]);

const processContactStore = useProcessContactPersonStore();
const personStore = usePersonStore();
const addressStore = useAddressStore();
const contractorStore = useContractorStore();
const snackbarStore = useSnackbarStore();

// Cópia local editável (não muta a prop original)
const form = ref(JSON.parse(JSON.stringify(props.contact)));

form.value.person.commercial_address = form.value.person.addresses.find(
  (a: DataAddress) => a.type === "COMMERCIAL"
)!;

form.value.person.residential_address = form.value.person.addresses.find(
  (a: DataAddress) => a.type === "RESIDENTIAL"
)!;

// CPF / CNPJ MASK DINÂMICA
const documentInput = computed({
  get() {
    const p = form.value.person;

    if (p.cpf) return formatCpfSmart(p.cpf);
    if (p.cnpj) return formatCnpjSmart(p.cnpj);

    return "";
  },
  set(value: string) {
    let digits = value.replace(/\D/g, "");

    if (digits.length <= 11) {
      form.value.person.cpf = cleanCpfStrict(digits);
      form.value.person.cnpj = null;
    } else {
      form.value.person.cpf = null;
      form.value.person.cnpj = cleanCnpjStrict(digits);
    }
  },
});

// PHONE MASKS
const phoneCommercialInput = computed({
  get() {
    return formatPhoneSmart(form.value.person.phone_commercial ?? "");
  },
  set(value: string) {
    form.value.person.phone_commercial = cleanPhoneStrict(value);
  },
});

const phonePersonalInput = computed({
  get() {
    return formatPhoneSmart(form.value.person.phone_personal ?? "");
  },
  set(value: string) {
    form.value.person.phone_personal = cleanPhoneStrict(value);
  },
});

// CEP MASK DINÂMICA COMERCIAL
const commercialZip = computed({
  get() {
    return formatCepSmart(form.value.person.commercial_address.zipcode);
  },
  set(value: string) {
    form.value.person.commercial_address.zipcode = cleanCepStrict(value);
  },
});

// CEP MASK DINÂMICA RESIDENCIAL
const residentialZip = computed({
  get() {
    return formatCepSmart(form.value.person.residential_address.zipcode);
  },
  set(value: string) {
    form.value.person.residential_address.zipcode = cleanCepStrict(value);
  },
});

// CEP AUTO-COMPLETE — Comercial
watch(
  () => form.value.person.commercial_address.zipcode,
  async (value) => {
    const cep = value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    const result = await searchZipCode(cep);
    if (result) {
      form.value.person.commercial_address.street = result.logradouro;
      form.value.person.commercial_address.neighborhood = result.bairro;
      form.value.person.commercial_address.city = result.cidade;
      form.value.person.commercial_address.state = result.estado;
      form.value.person.commercial_address.complement =
        result.complemento ?? "";
    }
  }
);

// CEP AUTO-COMPLETE — Residencial
watch(
  () => form.value.person.residential_address.zipcode,
  async (value) => {
    if (!value) return;
    const cep = value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    const result = await searchZipCode(cep);
    if (result) {
      const a = form.value.person.residential_address;
      a.street = result.logradouro;
      a.neighborhood = result.bairro;
      a.city = result.cidade;
      a.state = result.estado;
      a.complement = result.complemento ?? "";
    }
  }
);

// Formatação de Cidade e Estado Comercial
const cityStateCommercial = computed(() => {
  const a = form.value.person.commercial_address;
  return `${a.city}, ${STATES[a.state] || a.state}`;
});

const cityStateResidential = computed(() => {
  const a = form.value.person.residential_address;
  return `${a.city}, ${STATES[a.state] || a.state}`;
});

async function updateData() {
  try {
    // 1) Atualiza pessoa
    const personPayload = {
      name: form.value.person.name,
      cpf: form.value.person.cpf || null,
      cnpj: form.value.person.cnpj || null,
      email: form.value.person.email,
      phone_commercial: cleanPhone(form.value.person.phone_commercial),
      phone_personal: cleanPhone(form.value.person.phone_personal),
    };

    await personStore.update(form.value.person.id, personPayload);

    // 2) Endereço Comercial
    const commercialPayload = {
      zipcode: form.value.person.commercial_address.zipcode.replace(/\D/g, ""),
      street: form.value.person.commercial_address.street,
      number: form.value.person.commercial_address.number,
      neighborhood: form.value.person.commercial_address.neighborhood,
      complement: form.value.person.commercial_address.complement,
      city: form.value.person.commercial_address.city,
      state: form.value.person.commercial_address.state,
    };

    await addressStore.update(
      form.value.person.commercial_address.id,
      commercialPayload
    );

    // 3) Endereço Residencial
    const residentialPayload = {
      zipcode: form.value.person.residential_address.zipcode.replace(/\D/g, ""),
      street: form.value.person.residential_address.street,
      number: form.value.person.residential_address.number,
      neighborhood: form.value.person.residential_address.neighborhood,
      complement: form.value.person.residential_address.complement,
      city: form.value.person.residential_address.city,
      state: form.value.person.residential_address.state,
    };

    await addressStore.update(
      form.value.person.residential_address.id,
      residentialPayload
    );

    // 4) Atualizar ProcessContactPerson
    const processPayload = {
      person_id: form.value.person.id,
      contractor_id: form.value.contractor.id,
    };

    await processContactStore.update(form.value.id, processPayload);
    await contractorStore.findAll();
    snackbarStore.showSnackbar("Registro atualizado!", "success");
    emit("close");
  } catch (error) {
    console.error(error);
    snackbarStore.showSnackbar("Erro ao atualizar contato!", "error");
  }
}
</script>
