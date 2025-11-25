import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataAddress,
  NewDataAddress,
  UpdateDataAddress,
} from "@/types/addresses/AddressTypes";

export const useAddressStore = defineStore("addressStore", () => {
  const address = ref<DataAddress | null>(null);
  const loading = ref(false);

  async function findById(id: string) {
    try {
      loading.value = true;
      const result = await API.addressService.findById(id);
      address.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: NewDataAddress) {
    try {
      loading.value = true;
      return await API.addressService.create(payload);
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, payload: UpdateDataAddress) {
    try {
      loading.value = true;
      const updated = await API.addressService.update(id, payload);
      address.value = updated;
      return updated;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: string) {
    try {
      loading.value = true;
      return await API.addressService.delete(id);
    } finally {
      loading.value = false;
    }
  }

  return {
    address,
    loading,
    findById,
    create,
    update,
    remove,
  };
});
