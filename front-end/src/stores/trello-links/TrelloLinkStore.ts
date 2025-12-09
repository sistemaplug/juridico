import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataTrelloLink,
  NewDataTrelloLink,
  UpdateDataTrelloLink,
} from "@/types/trello-links/TrelloLinkTypes";

export const useTrelloLinksStore = defineStore("trelloLinks", () => {
  const links = ref<DataTrelloLink[]>([]);
  const selectedLink = ref<DataTrelloLink | null>(null);
  const loading = ref(false);

  async function create(data: NewDataTrelloLink) {
    loading.value = true;
    try {
      return await API.trelloLinkService.create(data);
    } finally {
      loading.value = false;
    }
  }

  async function findByService(serviceId: string) {
    loading.value = true;
    try {
      links.value = await API.trelloLinkService.findByService(serviceId);
      return links.value;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, data: UpdateDataTrelloLink) {
    loading.value = true;
    try {
      return await API.trelloLinkService.update(id, data);
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: string) {
    loading.value = true;
    try {
      return await API.trelloLinkService.delete(id);
    } finally {
      loading.value = false;
    }
  }

  return {
    links,
    selectedLink,
    loading,
    create,
    findByService,
    update,
    remove,
  };
});
