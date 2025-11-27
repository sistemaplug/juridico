import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataProcessContactPerson,
  NewDataProcessContactPerson,
  UpdateDataProcessContactPerson,
} from "@/types/process-contacts-person/ProcessContactPersonTypes";

export const useProcessContactPersonStore = defineStore(
  "processContactPerson",
  () => {
    const processContactPerson = ref<DataProcessContactPerson[]>([]);
    const selectedProcessContactPerson = ref<DataProcessContactPerson | null>(
      null
    );
    const loading = ref(false);

    async function create(data: NewDataProcessContactPerson) {
      loading.value = true;
      try {
        return await API.processContactPersonService.create(data);
      } finally {
        loading.value = false;
      }
    }

    async function findAll() {
      loading.value = true;
      try {
        processContactPerson.value =
          await API.processContactPersonService.findAll();
        return processContactPerson.value;
      } finally {
        loading.value = false;
      }
    }

    async function findById(id: string) {
      loading.value = true;
      try {
        const result = await API.processContactPersonService.findById(id);
        selectedProcessContactPerson.value = result;
        return result;
      } finally {
        loading.value = false;
      }
    }

    async function findByContractor(contractorId: string) {
      loading.value = true;
      try {
        const result = await API.processContactPersonService.findByContractor(
          contractorId
        );

        processContactPerson.value = result;
        selectedProcessContactPerson.value = result[0] ?? null;
        return result;
      } finally {
        loading.value = false;
      }
    }

    async function update(id: string, data: UpdateDataProcessContactPerson) {
      loading.value = true;
      try {
        return await API.processContactPersonService.update(id, data);
      } finally {
        loading.value = false;
      }
    }

    async function remove(id: string) {
      loading.value = true;
      try {
        return await API.processContactPersonService.delete(id);
      } finally {
        loading.value = false;
      }
    }

    return {
      processContactPerson,
      selectedProcessContactPerson,
      loading,
      create,
      findAll,
      findById,
      findByContractor,
      update,
      remove,
    };
  }
);
