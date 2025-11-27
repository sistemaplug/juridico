import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataPerson,
  NewDataPerson,
  UpdateDataPerson,
} from "@/types/persons/PersonTypes";

export const usePersonStore = defineStore("person", () => {
  const person = ref<DataPerson[]>([]);
  const personSelected = ref<DataPerson | null>(null);
  const loading = ref(false);

  async function create(data: NewDataPerson) {
    loading.value = true;
    try {
      return await API.personService.create(data);
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function findAll() {
    loading.value = true;
    try {
      person.value = await API.personService.findAll();
      return person.value;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function active() {
    loading.value = true;
    try {
      person.value = await API.personService.findAllActive();
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }

  async function inactive() {
    loading.value = true;
    try {
      person.value = await API.personService.findAllInactive();
    } catch (error) {
    } finally {
      loading.value = false;
    }
  }

  async function findById(id: string) {
    loading.value = true;
    try {
      const person = await API.personService.findById(id);
      personSelected.value = person;
      return person;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, data: UpdateDataPerson) {
    loading.value = true;
    try {
      return await API.personService.update(id, data);
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function deactivate(id: string) {
    loading.value = true;
    try {
      return await API.personService.deactivate(id);
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    person,
    personSelected,
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
