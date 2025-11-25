import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataProcessContact,
  NewDataProcessContact,
  UpdateDataProcessContact,
} from "@/types/process-contacts/ProcessContactTypes";

export const useProcessContactStore = defineStore("processContact", () => {
  const processContact = ref<DataProcessContact[]>([]);
  const selectedProcessContact = ref<DataProcessContact | null>(null);
  const loading = ref(false);

  async function create(data: NewDataProcessContact) {
    loading.value = true;
    try {
      return await API.processContactService.create(data);
    } finally {
      loading.value = false;
    }
  }

  async function findAll() {
    loading.value = true;
    try {
      processContact.value = await API.processContactService.findAll();
      return processContact.value;
    } finally {
      loading.value = false;
    }
  }

  async function findById(id: string) {
    loading.value = true;
    try {
      const processContact = await API.processContactService.findById(id);
      selectedProcessContact.value = processContact;
      return processContact;
    } finally {
      loading.value = false;
    }
  }

  async function findByContractor(contractorId: string) {
    loading.value = true;
    try {
      const processContact = await API.processContactService.findByContractor(
        contractorId
      );
      selectedProcessContact.value = processContact;
      return processContact;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, data: UpdateDataProcessContact) {
    loading.value = true;
    try {
      return await API.processContactService.update(id, data);
    } finally {
      loading.value = false;
    }
  }

  async function deactivate(id: string) {
    loading.value = true;
    try {
      return await API.processContactService.deactivate(id);
    } finally {
      loading.value = false;
    }
  }

  return {
    processContact,
    selectedProcessContact,
    loading,
    create,
    findAll,
    findById,
    findByContractor,
    update,
    deactivate,
  };
});
