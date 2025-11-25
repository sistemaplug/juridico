import { defineStore } from "pinia";
import { ref } from "vue";
import { API } from "@/services/module/API";
import type {
  DataContract,
  NewDataContract,
  UpdateDataContract,
} from "@/types/contracts/ContractTypes";

export const useContractStore = defineStore("contract", () => {
  const contracts = ref<DataContract[]>([]);
  const selectedContract = ref<DataContract | null>(null);
  const loading = ref(false);

  async function create(data: NewDataContract) {
    loading.value = true;
    try {
      return await API.contractService.create(data);
    } finally {
      loading.value = false;
    }
  }

  async function findAll() {
    loading.value = true;
    try {
      contracts.value = await API.contractService.findAll();
      return contracts.value;
    } finally {
      loading.value = false;
    }
  }

  async function findById(id: string) {
    loading.value = true;
    try {
      const contract = await API.contractService.findById(id);
      selectedContract.value = contract;
      return contract;
    } finally {
      loading.value = false;
    }
  }

  async function findByContractor(contractorId: string) {
    loading.value = true;
    try {
      const contract = await API.contractService.findByContractor(contractorId);
      selectedContract.value = contract;
      return contract;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, data: UpdateDataContract) {
    loading.value = true;
    try {
      return await API.contractService.update(id, data);
    } finally {
      loading.value = false;
    }
  }

  async function deactivate(id: string) {
    loading.value = true;
    try {
      return await API.contractService.deactivate(id);
    } finally {
      loading.value = false;
    }
  }

  return {
    contracts,
    selectedContract,
    loading,
    create,
    findAll,
    findById,
    findByContractor,
    update,
    deactivate,
  };
});
