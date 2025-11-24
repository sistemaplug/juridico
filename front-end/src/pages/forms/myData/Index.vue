<template>
  <v-container class="d-flex justify-center mt-10">
    <v-card style="width: 100%; max-width: 700px" class="pb-10" elevation="5">
      <v-tabs
        v-model="tab"
        centered
        icons-and-text
        class="pt-20"
        grow
        style="background-color: #1e90ff; color: white"
      >
        <v-tabs-slider />

        <v-tab value="tab-1">
          Informações
          <v-icon>mdi-information-outline</v-icon>
        </v-tab>

        <v-tab value="tab-2">
          Senha
          <v-icon>mdi-lock-outline</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-1">
          <template v-if="tab === 'tab-1'">
            <FormMyInfo />
          </template>
        </v-tab-item>

        <v-tab-item value="tab-2">
          <template v-if="tab === 'tab-2'">
            <FormMyPassword />
          </template>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormMyPassword from "@/pages/forms/myData/FormMyPassword.vue";
import FormMyInfo from "@/pages/forms/myData/FormMyInfo.vue";

const tab = ref<string>("tab-1");
</script>
