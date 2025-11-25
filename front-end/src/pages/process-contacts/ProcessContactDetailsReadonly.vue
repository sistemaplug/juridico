<template>
  <!-- Não existe registro -->
  <v-alert
    v-if="!contact"
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
          :model-value="contact.name"
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
          :model-value="formatPhone(contact.phone_commercial)"
          label="Fone | Comercial"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>

      <v-col>
        <v-text-field
          :model-value="formatPhone(contact.phone_personal)"
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
          :model-value="contact.email"
          label="E-mail"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>

    <v-divider class="mb-4" />
    <!-- Endereço Comercial -->
    <div class="pb-4">
      <v-card-title>Endereço Comercial:</v-card-title>
    </div>

    <v-row>
      <v-col cols="6">
        <v-text-field
          :model-value="formatZipcode(contact.commercial_address.zipcode)"
          label="CEP"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          :model-value="
            contact.commercial_address.city +
            ' - ' +
            contact.commercial_address.state
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
          :model-value="formatAddress(contact.commercial_address)"
          label="Endereço | Comercial"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>

    <v-divider class="mb-4" />
    <!-- Endereço Residencial -->
    <div class="pb-4">
      <v-card-title>Endereço Residencial:</v-card-title>
    </div>

    <v-row>
      <v-col cols="6">
        <v-text-field
          :model-value="formatZipcode(contact.residential_address.zipcode)"
          label="CEP"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          :model-value="
            contact.residential_address.city +
            ' - ' +
            contact.residential_address.state
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
          :model-value="formatAddress(contact.residential_address)"
          label="Endereço | Residencial"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>
  </template>
</template>

<script setup lang="ts">
import {
  formatCpf,
  formatCnpj,
  formatPhone,
  formatZipcode,
  formatAddress,
} from "@/filters";
import type { DataProcessContact } from "@/types/process-contacts/ProcessContactTypes";

const props = defineProps<{ contact: DataProcessContact | null }>();

const formattedDocument = computed(() => {
  const c = props.contact;
  if (!c) return "—";

  if (c.cpf) return formatCpf(c.cpf);
  if (c.cnpj) return formatCnpj(c.cnpj);

  return "Não informado";
});
</script>
