import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataService,
  NewDataService,
  UpdateDataService,
} from "@/types/services-contractors/ServiceContractorTypes";

export const useServiceContractorStore = defineStore(
  "serviceContractor",
  () => {
    const serviceContractor = ref<DataService[]>([]);
    const selectedServiceContractor = ref<DataService | null>(null);
    const loading = ref(false);

    async function create(data: NewDataService) {
      loading.value = true;
      try {
        return await API.service.create(data);
      } finally {
        loading.value = false;
      }
    }

    async function findAll() {
      loading.value = true;
      try {
        serviceContractor.value = await API.service.findAll();
        return serviceContractor.value;
      } finally {
        loading.value = false;
      }
    }

    async function findById(id: string) {
      loading.value = true;
      try {
        const serviceContractor = await API.service.findById(id);
        selectedServiceContractor.value = serviceContractor;
        return serviceContractor;
      } finally {
        loading.value = false;
      }
    }
    
    async function findByContractor(contractorId: string) {
      loading.value = true;
      try {
        const result = await API.service.findByContractor(contractorId);

        serviceContractor.value = result;

        selectedServiceContractor.value = result[0] ?? null;

        return result;
      } finally {
        loading.value = false;
      }
    }

    async function update(id: string, data: UpdateDataService) {
      loading.value = true;
      try {
        return await API.service.update(id, data);
      } finally {
        loading.value = false;
      }
    }

    async function deactivate(id: string) {
      loading.value = true;
      try {
        return await API.service.deactivate(id);
      } finally {
        loading.value = false;
      }
    }

    return {
      serviceContractor,
      selectedServiceContractor,
      loading,
      create,
      findAll,
      findById,
      findByContractor,
      update,
      deactivate,
    };
  }
);
