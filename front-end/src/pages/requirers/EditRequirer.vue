<template>
  <!-- Nome / CPF-CNPJ -->
  <v-row>
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
        v-model="form.email"
        label="E-mail"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-divider class="my-4" />

  <!-- Endereço Comercial -->
  <div class="pb-2">
    <v-card-title>Endereço Comercial</v-card-title>
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
        v-model="form.address.street"
        label="Rua"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.address.number"
        label="Número"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-text-field
        v-model="form.address.neighborhood"
        label="Bairro"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="form.address.complement"
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

  <v-btn color="primary" class="mt-4" @click="updateData">
    <v-icon start>mdi-content-save</v-icon>
    Salvar Registro
  </v-btn>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRequirerStore } from "@/stores/requirers/RequirerStore";
import { useAddressStore } from "@/stores/addresses/AddressStore";
import { useSnackbarStore } from "@/stores/snackbarStore";

import {
  formatCpf,
  formatCnpj,
  cleanPhone,
  formatPhone,
  formatZipcode,
} from "@/filters";

import { searchZipCode } from "@/utils/searchZipCode";
import { STATES } from "@/assets/states";
import type { DataRequirer } from "@/types/requirers/RequirerTypes";

const props = defineProps<{ requirer: DataRequirer & { address: any } }>();
const emit = defineEmits(["close"]);

const requirerStore = useRequirerStore();
const addressStore = useAddressStore();
const snackbarStore = useSnackbarStore();

// Cópia local DO REQUERER
const form = ref(JSON.parse(JSON.stringify(props.requirer)));

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

// CEP MASK DINÂMICA COMERCIAL
const commercialZip = computed({
  get() {
    return formatZipcode(form.value.address.zipcode);
  },
  set(value: string) {
    form.value.address.zipcode = value.replace(/\D/g, "").slice(0, 8);
  },
});

// CEP AUTO-COMPLETE — Comercial
watch(
  () => form.value.address.zipcode,
  async (value) => {
    const cep = value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    const res = await searchZipCode(cep);

    if (res) {
      form.value.address.street = res.logradouro;
      form.value.address.neighborhood = res.bairro;
      form.value.address.city = res.cidade;
      form.value.address.state = res.estado;
      form.value.address.complement = res.complemento ?? "";
    }
  }
);

// Cidade + Estado formatado
const cityStateCommercial = computed({
  get() {
    return `${form.value.address.city}, ${
      STATES[form.value.address.state] || form.value.address.state
    }`;
  },
  set(value: string) {
    const [city, uf] = value.split(",").map((v) => v.trim());
    if (city) form.value.address.city = city;
    if (uf) form.value.address.state = uf;
  },
});

async function updateData() {
  try {
    // Atualiza o requirer
    const requirerPayload = {
      name: form.value.name,
      cpf: form.value.cpf || null,
      cnpj: form.value.cnpj || null,
      email: form.value.email,
      phone_commercial: cleanPhone(form.value.phone_commercial),
    };

    await requirerStore.update(form.value.id, requirerPayload);

    // Atualiza o endereço
    const addressPayload = {
      zipcode: form.value.address.zipcode.replace(/\D/g, ""),
      street: form.value.address.street,
      number: form.value.address.number,
      neighborhood: form.value.address.neighborhood,
      complement: form.value.address.complement,
      city: form.value.address.city,
      state: form.value.address.state,
    };

    await addressStore.update(form.value.address.id, addressPayload);

    snackbarStore.showSnackbar("Registro atualizado!", "success");
    emit("close");
  } catch (err) {
    console.error(err);
    snackbarStore.showSnackbar("Erro ao atualizar registro!", "error");
  }
}
</script>
