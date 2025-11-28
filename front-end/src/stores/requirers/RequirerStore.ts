import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataRequirer,
  NewDataRequirer,
  UpdateDataRequirer,
} from "@/types/requirers/RequirerTypes";

export const useRequirerStore = defineStore("requirer", () => {
  const requirers = ref<DataRequirer[]>([]);
  const selectedRequirer = ref<DataRequirer | null>(null);
  const loading = ref(false);

  async function create(data: NewDataRequirer) {
    loading.value = true;
    try {
      return await API.requirerService.create(data);
    } finally {
      loading.value = false;
    }
  }

  async function findAll() {
    loading.value = true;
    try {
      const result = await API.requirerService.findAll();
      requirers.value = result;
      selectedRequirer.value = result[0] ?? null;
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function findById(id: string) {
    loading.value = true;
    try {
      const result = await API.requirerService.findById(id);
      selectedRequirer.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function findByContractor(contractorId: string) {
    loading.value = true;
    try {
      const result = await API.requirerService.findByContractor(contractorId);

      requirers.value = result;

      selectedRequirer.value = result[0] ?? null;

      return result;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, data: UpdateDataRequirer) {
    loading.value = true;
    try {
      return await API.requirerService.update(id, data);
    } finally {
      loading.value = false;
    }
  }

  async function deactivate(id: string) {
    loading.value = true;
    try {
      return await API.requirerService.deactivate(id);
    } finally {
      loading.value = false;
    }
  }

  return {
    requirers,
    selectedRequirer,
    loading,
    create,
    findAll,
    findById,
    findByContractor,
    update,
    deactivate,
  };
});
