<template>
  <!-- TÍTULO -->
  <v-card-title class="text-h6 mb-4">Detalhes do Serviço</v-card-title>

  <!-- CAMPOS DO SERVIÇO -->
  <v-row>
    <v-col>
      <v-text-field
        v-model="localService.type"
        label="Tipo do Serviço"
        variant="outlined"
        density="compact"
      />
    </v-col>

    <v-col>
      <v-select
        v-model="localService.status"
        :items="statusOptions"
        item-title="title"
        item-value="value"
        label="Status"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-select
        v-model="localService.is_active"
        :items="activeOptions"
        item-title="title"
        item-value="value"
        label="Situação"
        variant="outlined"
        density="compact"
      />
    </v-col>
  </v-row>

  <v-divider class="my-6" />

  <!-- LINKS DO TRELLO -->
  <v-card-title class="text-h6 mb-4">Links do Trello</v-card-title>

  <!-- LISTA DOS LINKS EXISTENTES -->
  <v-row v-for="link in localService.trello_links" :key="link.id" class="mb-3">
    <v-col>
      <v-card elevation="1" class="pa-4">
        <!-- Observação -->
        <v-text-field
          v-model="link.observation"
          label="Observação"
          variant="outlined"
          density="compact"
        />

        <!-- URL -->
        <v-text-field
          v-model="link.url"
          label="URL do Trello"
          variant="outlined"
          density="compact"
        />

        <!-- BOTÕES DE AÇÃO -->
        <div class="d-flex justify-end mt-3 ga-3">
          <v-btn
            color="primary"
            variant="tonal"
            prepend-icon="mdi-open-in-new"
            :href="link.url"
            target="_blank"
          >
            Abrir Trello
          </v-btn>

          <v-btn
            color="error"
            variant="tonal"
            prepend-icon="mdi-delete"
            @click="removeLink(link.id)"
          >
            Remover
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <!-- ADICIONAR NOVO LINK -->
  <v-btn
    color="primary"
    variant="tonal"
    prepend-icon="mdi-plus"
    class="mt-2"
    @click="addNewLink"
  >
    Adicionar Link
  </v-btn>

  <v-divider class="my-6" />

  <!-- BOTÕES FINAIS -->
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

  <DeleteTrelloLinkModal
    v-model="showDeleteModal"
    :trelloId="linkToDelete"
    @deleted="handleDeleted"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { DataService } from "@/types/services-contractors/ServiceContractorTypes";
import type { NewDataTrelloLink } from "@/types/trello-links/TrelloLinkTypes";
import { useServiceContractorStore } from "@/stores/services-contractors/ServiceContractorStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useTrelloLinksStore } from "@/stores/trello-links/TrelloLinkStore";
import DeleteTrelloLinkModal from "@/components/modals/DeleteTrelloLinkModal.vue";

const props = defineProps<{ service: DataService }>();
const emit = defineEmits(["close"]);

const serviceStore = useServiceContractorStore();
const trelloStore = useTrelloLinksStore();
const snackbarStore = useSnackbarStore();

const showDeleteModal = ref(false);
const linkToDelete = ref<string | null>(null);

/* CÓPIA LOCAL EDITÁVEL */
const localService = ref<DataService>({
  ...props.service,
  trello_links: [...props.service.trello_links],
});

function handleDeleted(id: string) {
  localService.value.trello_links = localService.value.trello_links.filter(
    (l) => l.id !== id
  );
}

/* SELECT – STATUS */
const statusOptions = [
  { title: "Pendente", value: "PENDING" },
  { title: "Em andamento", value: "IN_PROGRESS" },
  { title: "Concluído", value: "COMPLETED" },
  { title: "Cancelado", value: "CANCELED" },
];

/* SELECT – SITUAÇÃO */
const activeOptions = [
  { title: "Ativo", value: true },
  { title: "Inativo", value: false },
];

/* Adicionar novo link */
function addNewLink() {
  const newLink: NewDataTrelloLink = {
    url: "",
    observation: "",
    service_id: localService.value.id,
  };

  // adiciona o novo link sem id ao array
  localService.value.trello_links.push(newLink as any);
}

/* Remover link */
function removeLink(id: string) {
  linkToDelete.value = id;
  showDeleteModal.value = true;
}

/* Atualizar o serviço + links */
async function updateData() {
  try {
    // Atualiza os campos do serviço
    await serviceStore.update(localService.value.id, {
      type: localService.value.type,
      status: localService.value.status,
      is_active: localService.value.is_active,
    });

    // Atualiza cada link individualmente
    for (const link of localService.value.trello_links) {
      if (props.service.trello_links.some((l) => l.id === link.id)) {
        await trelloStore.update(link.id, {
          url: link.url,
          observation: link.observation,
        });
      } else {
        await trelloStore.create(link);
      }
    }

    snackbarStore.showSnackbar("Serviço atualizado com sucesso!", "success");
    emit("close");
  } catch (error) {
    console.error(error);
    snackbarStore.showSnackbar("Erro ao atualizar serviço!", "error");
  }
}
</script>
