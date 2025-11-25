import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataContractor,
  NewDataContractor,
  UpdateDataContractor,
} from "@/types/contractors/ContractorTypes";

export const useContractorStore = defineStore("contractor", () => {
  const contractors = ref<DataContractor[]>([]);
  const contractorSelected = ref<DataContractor | null>(null);
  const loading = ref(false);

  async function create(data: NewDataContractor) {
    loading.value = true;
    try {
      return await API.contractorService.create(data);
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function findAll() {
    loading.value = true;
    try {
      contractors.value = await API.contractorService.findAll();
      return contractors.value;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function active() {
    loading.value = true;
    try {
      contractors.value = await API.contractorService.findAllActive();
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }

  async function inactive() {
    loading.value = true;
    try {
      contractors.value = await API.contractorService.findAllInactive();
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }

  async function findById(id: string) {
    loading.value = true;
    try {
      const contractor = await API.contractorService.findById(id);
      contractorSelected.value = contractor;
      return contractor;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, data: UpdateDataContractor) {
    loading.value = true;
    try {
      return await API.contractorService.update(id, data);
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function deactivate(id: string) {
    loading.value = true;
    try {
      return await API.contractorService.deactivate(id);
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    contractors,
    contractorSelected,
    loading,
    create,
    findAll,
    active,
    inactive,
    findById,
    update,
    deactivate,
  };
});
