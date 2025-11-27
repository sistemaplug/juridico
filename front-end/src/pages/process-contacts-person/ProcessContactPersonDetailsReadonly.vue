<template>
  <!-- Nenhum registro -->
  <v-alert
    v-if="!first"
    type="info"
    text="Nenhum contato cadastrado para este cliente!"
    variant="tonal"
    class="mt-4"
  />

  <!-- Existe registro -->
  <template v-else>
    <!-- Nome / CPF-CNPJ -->
    <v-row>
      <v-col>
        <v-text-field
          :model-value="first.person.name"
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

    <!-- Telefones -->
    <v-row>
      <v-col>
        <v-text-field
          :model-value="formatPhone(first?.person?.phone_commercial ?? '')"
          label="Fone | Comercial"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>

      <v-col>
        <v-text-field
          :model-value="formatPhone(first?.person?.phone_personal ?? '')"
          label="Fone | Pessoal"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>

    <!-- Email -->
    <v-row>
      <v-col>
        <v-text-field
          :model-value="first.person.email"
          label="E-mail"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <!-- ENDEREÇO COMERCIAL -->
    <div v-if="hasCommercialAddress">
      <div class="pb-4">
        <v-card-title>Endereço Comercial:</v-card-title>
      </div>

      <v-row>
        <v-col cols="6">
          <v-text-field
            :model-value="
              formatZipcode(commercialAddress!.zipcode)
            "
            label="CEP"
            variant="outlined"
            density="compact"
            readonly
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            :model-value="
              commercialAddress!.city +
              ' - ' +
              commercialAddress!.state
            "
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
    </div>

    <!-- Se NÃO existir endereço comercial -->
    <div v-else class="text-grey-darken-1 mb-6">
      <i>Este contato não possui endereço comercial cadastrado.</i>
    </div>

    <v-divider class="my-6" />

    <!-- ENDEREÇO RESIDENCIAL -->
    <div v-if="hasResidentialAddress">
      <div class="pb-4">
        <v-card-title>Endereço Residencial:</v-card-title>
      </div>

      <v-row>
        <v-col cols="6">
          <v-text-field
            :model-value="
              formatZipcode(residentialAddress!.zipcode)
            "
            label="CEP"
            variant="outlined"
            density="compact"
            readonly
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            :model-value="
              residentialAddress!.city +
              ' - ' +
              residentialAddress!.state
            "
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
            :model-value="formatAddress(residentialAddress)"
            label="Endereço | Residencial"
            variant="outlined"
            density="compact"
            readonly
          />
        </v-col>
      </v-row>
    </div>

    <!-- Se NÃO existir endereço residencial -->
    <div v-else class="text-grey-darken-1">
      <i>Este contato não possui endereço residencial cadastrado.</i>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  formatCpf,
  formatCnpj,
  formatPhone,
  formatZipcode,
  formatAddress,
} from "@/filters";
import type { DataProcessContactPerson } from "@/types/process-contacts-person/ProcessContactPersonTypes";

const props = defineProps<{
  contact: DataProcessContactPerson | null;
}>();

// Pega o primeiro registro da lista
const first = computed(() => props.contact);

// Documento (CPF ou CNPJ)
const formattedDocument = computed(() => {
  const f = first.value;
  if (!f) return "—";

  if (f.person.cpf) return formatCpf(f.person.cpf);
  if (f.person.cnpj) return formatCnpj(f.person.cnpj);

  return "Não informado";
});

const commercialAddress = computed(() => {
  return (
    first.value?.person.addresses.find((a) => a.type === "COMMERCIAL") ?? null
  );
});

const residentialAddress = computed(() => {
  return (
    first.value?.person.addresses.find((a) => a.type === "RESIDENTIAL") ?? null
  );
});

const hasCommercialAddress = computed(() => {
  const addr = commercialAddress.value;
  if (!addr) return false;
  return Object.values(addr).some((v) => v && v !== "");
});

const hasResidentialAddress = computed(() => {
  const addr = residentialAddress.value;
  if (!addr) return false;
  return Object.values(addr).some((v) => v && v !== "");
});
</script>
