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

  <!-- Telefone e E-mail -->
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
        v-model="commercial.street"
        label="Rua"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="commercial.number"
        label="Número"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="commercial.neighborhood"
        label="Bairro"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="commercial.complement"
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

  <!-- Botões -->
  <div class="d-flex justify-end ga-4">
    <v-btn color="error" @click="emit('close')">
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
import { ref, computed, watch } from "vue";
import type { DataRequirer } from "@/types/requirers/RequirerTypes";

import { useAddressStore } from "@/stores/addresses/AddressStore";
import { usePersonStore } from "@/stores/persons/PersonStore";
import { useSnackbarStore } from "@/stores/snackbarStore";

import {
  cleanCpfStrict,
  cleanCnpjStrict,
  formatCpfSmart,
  formatCnpjSmart,
  formatPhoneSmart,
  cleanPhoneStrict,
  cleanCepStrict,
  formatCepSmart,
} from "@/filters";

import { STATES } from "@/assets/states";
import { searchZipCode } from "@/utils/searchZipCode";
import { useRequirerStore } from "@/stores/requirers/RequirerStore";
import { useContractorStore } from "@/stores/contractors/ContractorStore";

const props = defineProps<{ requirer: DataRequirer }>();
const emit = defineEmits(["close"]);

const personStore = usePersonStore();
const addressStore = useAddressStore();
const requirerStore = useRequirerStore();
const contractorStore = useContractorStore();
const snackbarStore = useSnackbarStore();

// Cópia local editável (não muta a prop original)
const form = ref(JSON.parse(JSON.stringify(props.requirer)));

/* Endereço Comercial ÚNICO */
const commercial = ref(
  form.value.person.addresses.find((a: any) => a.type === "COMMERCIAL")
);

// CPF / CNPJ MASK DINÂMICA
const documentInput = computed({
  get() {
    const p = form.value.person;
    if (p.cpf) return formatCpfSmart(p.cpf);
    if (p.cnpj) return formatCnpjSmart(p.cnpj);
    return "";
  },
  set(v: string) {
    const digits = v.replace(/\D/g, "");
    if (digits.length <= 11) {
      form.value.person.cpf = cleanCpfStrict(v);
      form.value.person.cnpj = null;
    } else {
      form.value.person.cpf = null;
      form.value.person.cnpj = cleanCnpjStrict(v);
    }
  },
});

// PHONE MASK
const phoneCommercialInput = computed({
  get: () => formatPhoneSmart(form.value.person.phone_commercial ?? ""),
  set: (v) => (form.value.person.phone_commercial = cleanPhoneStrict(v)),
});

// CEP MASK DINÂMICA COMERCIAL
const commercialZip = computed({
  get: () => formatCepSmart(commercial.value.zipcode),
  set: (v) => (commercial.value.zipcode = cleanCepStrict(v)),
});

// CEP AUTO-COMPLETE — Comercial
watch(
  () => commercial.value.zipcode,
  async (value) => {
    const cep = cleanCepStrict(value);
    if (cep.length !== 8) return;

    const res = await searchZipCode(cep);
    if (res) {
      commercial.value.street = res.logradouro;
      commercial.value.neighborhood = res.bairro;
      commercial.value.city = res.cidade;
      commercial.value.state = res.estado;
      commercial.value.complement = res.complemento ?? "";
    }
  }
);

// Formatação de Cidade e Estado
const cityStateCommercial = computed({
  get() {
    const c = commercial.value;
    return `${c.city}, ${STATES[c.state] || c.state}`;
  },
  set(v: string) {
    const [city, uf] = v.split(",").map((s) => s.trim());
    if (city) commercial.value.city = city;
    if (uf) commercial.value.state = uf;
  },
});

async function updateData() {
  try {
    // 1) Atualiza PERSON
    await personStore.update(form.value.person.id, {
      name: form.value.person.name,
      cpf: form.value.person.cpf || null,
      cnpj: form.value.person.cnpj || null,
      email: form.value.person.email,
      phone_commercial: cleanPhoneStrict(form.value.person.phone_commercial),
    });

    // 2) Atualiza endereço COMERCIAL
    await addressStore.update(commercial.value.id, {
      zipcode: commercial.value.zipcode.replace(/\D/g, ""),
      street: commercial.value.street,
      number: commercial.value.number,
      neighborhood: commercial.value.neighborhood,
      complement: commercial.value.complement,
      city: commercial.value.city,
      state: commercial.value.state,
    });

    // 3) Atualizar o Requirer no backend (person_id + contractor_id)
    await requirerStore.update(form.value.id, {
      person_id: form.value.person.id,
      contractor_id: form.value.contractor_id,
    });

    // 4) FORÇA RECARREGAMENTO DO REQUERENTE ATUALIZADO
    const updated = await requirerStore.findById(form.value.id);

    // Define como selecionado novamente para refletir no modal pai
    requirerStore.selectedRequirer = updated;
    await contractorStore.findAll();
    snackbarStore.showSnackbar("Registro atualizado!", "success");

    emit("close");
  } catch (error) {
    snackbarStore.showSnackbar("Erro ao atualizar o requerente!", "error");
  }
}
</script>
