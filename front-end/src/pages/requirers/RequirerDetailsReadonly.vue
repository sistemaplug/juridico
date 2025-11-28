<template>
  <!-- Não existe registro -->
  <v-alert
    v-if="!safeRequirer"
    type="info"
    text="Nenhum requerente cadastrado para este cliente!"
    variant="tonal"
    class="mt-4"
  />

  <template v-else>
    <!-- Nome / CPF-CNPJ -->
    <v-row>
      <v-col>
        <v-text-field
          :model-value="safeRequirer.person?.name ?? ''"
          label="Nome | Razão Social"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>

      <v-col>
        <v-text-field
          :model-value="formattedDocument"
          label="CPF | CNPJ"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>

    <!-- Telefone e E-mail -->
    <v-row>
      <v-col>
        <v-text-field
          :model-value="
            formatPhone(safeRequirer.person?.phone_commercial ?? '')
          "
          label="Fone | Comercial"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>

      <v-col>
        <v-text-field
          :model-value="safeRequirer.person?.email ?? ''"
          label="E-mail"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>

    <v-divider class="mb-4" />

    <div class="pb-2">
      <v-card-title>Endereço Comercial:</v-card-title>
    </div>

    <template v-if="commercialAddress">
      <v-row>
        <v-col cols="6">
          <v-text-field
            :model-value="formatZipcode(commercialAddress.zipcode)"
            label="CEP"
            variant="outlined"
            density="compact"
            readonly
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            :model-value="`${commercialAddress.city} - ${commercialAddress.state}`"
            label="Localidade | UF"
            variant="outlined"
            density="compact"
            readonly
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            :model-value="formatAddress(commercialAddress)"
            label="Endereço | Comercial"
            variant="outlined"
            density="compact"
            readonly
          />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-alert
        type="warning"
        text="Nenhum endereço cadastrado."
        variant="tonal"
        class="mt-2"
      />
    </template>
  </template>
</template>

<script lang="ts" setup>
import {
  formatAddress,
  formatCnpj,
  formatCpf,
  formatPhone,
  formatZipcode,
} from "@/filters";

import { computed } from "vue";
import type { DataRequirer } from "@/types/requirers/RequirerTypes";

const props = defineProps<{ requirer: DataRequirer | null }>();

// proteção — garante que o componente dispare apenas quando tudo existir
const safeRequirer = computed(() => props.requirer ?? null);

// Documento formatado
const formattedDocument = computed(() => {
  const p = safeRequirer.value?.person;
  if (!p) return "—";

  if (p.cpf) return formatCpf(p.cpf);
  if (p.cnpj) return formatCnpj(p.cnpj);
  return "Não informado";
});

// Endereço comercial
const commercialAddress = computed(() => {
  const person = safeRequirer.value?.person;
  if (!person || !Array.isArray(person.addresses)) return null;

  return person.addresses.find((a) => a.type === "COMMERCIAL") ?? null;
});
</script>
