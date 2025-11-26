<template>
  <!-- Não existe registro -->
  <v-alert
    v-if="!requirer"
    type="info"
    text="Nenhum requerente cadastrado para este cliente!"
    variant="tonal"
    class="mt-4"
  />

  <!-- Existe registro -->
  <template v-else>
    <!-- Nome / CPF-CNPJ -->
    <v-row>
      <v-col>
        <v-text-field
          :model-value="requirer.name"
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
          :model-value="formatPhone(requirer.phone_commercial)"
          label="Fone | Comercial"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>

      <v-col>
        <v-text-field
          :model-value="requirer.email"
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
          :model-value="formatZipcode(requirer.address.zipcode)"
          label="CEP"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          :model-value="requirer.address.city + ' - ' + requirer.address.state"
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
          :model-value="formatAddress(requirer.address)"
          label="Endereço | Comercial"
          variant="outlined"
          density="compact"
          readonly
        />
      </v-col>
    </v-row>
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
import type { DataRequirer } from "@/types/requirers/RequirerTypes";

const props = defineProps<{ requirer: DataRequirer | null }>();

const formattedDocument = computed(() => {
  const c = props.requirer;
  if (!c) return "—";

  if (c.cpf) return formatCpf(c.cpf);
  if (c.cnpj) return formatCnpj(c.cnpj);

  return "Não informado";
});
</script>
