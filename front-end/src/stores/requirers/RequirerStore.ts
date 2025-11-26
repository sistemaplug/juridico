import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataRequirer,
  NewDataRequirer,
  UpdateDataRequirer,
} from "@/types/requirers/RequirerTypes";

export const useRequirerStore = defineStore("requirer", () => {
  const requirer = ref<DataRequirer[]>([]);
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
      requirer.value = await API.requirerService.findAll();
      return requirer.value;
    } finally {
      loading.value = false;
    }
  }

  async function findById(id: string) {
    loading.value = true;
    try {
      const requirer = await API.requirerService.findById(id);
      selectedRequirer.value = requirer;
      return requirer;
    } finally {
      loading.value = false;
    }
  }

  async function findByContractor(contractorId: string) {
    loading.value = true;
    try {
      const requirer = await API.requirerService.findByContractor(contractorId);
      selectedRequirer.value = requirer;
      return requirer;
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
    requirer,
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
