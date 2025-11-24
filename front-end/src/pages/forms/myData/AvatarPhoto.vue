<template>
  <div class="d-flex flex-column align-center justify-center">
    <v-dialog v-model="dialogUpdate" width="700">
      <v-card outline class="pa-6">
        <camera
          ref="camera"
          :resolution="{ width: 640, height: 480 }"
          autoplay
        />
        <div class="d-flex flex-column">
          <v-btn
            depressed
            color=""
            class="d-flex align-center"
            @click="capture"
          >
            <v-icon size="16">mdi-camera</v-icon>
            <span class="ml-1">Tirar foto</span>
          </v-btn>
          <v-btn depressed color="" class="mt-3" @click="inputUpload?.click()">
            <v-icon size="16">mdi-cloud-upload</v-icon>
            <span class="ml-1">Procurar foto</span>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-avatar
      :size="size || 200"
      color="graySecondary"
      class="pointer"
      style="position: relative"
      @mouseover="upHere = true"
      @mouseleave="upHere = false"
    >
      <v-img v-if="currentAvatarUrl" :src="currentAvatarUrl" alt="Foto" />
      <v-icon v-else size="60" color="white">{{ icon }}</v-icon>
      <input
        v-show="false"
        ref="inputUpload"
        accept="image/*"
        type="file"
        @change="onUpload"
      />
      <div
        v-if="upHere || uploading"
        style="
          position: absolute;
          background-color: #00000060;
          width: 100%;
          height: 100%;
        "
        @click="dialogUpdate = true"
      >
        <div
          style="
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          "
        >
          <v-icon v-if="!uploading" color="white">mdi-camera</v-icon>
          <v-progress-circular v-else indeterminate color="primary" />
        </div>
      </div>
    </v-avatar>
  </div>
</template>

<script lang="ts">
import { ref, watch, defineComponent } from "vue";
import Camera from "simple-vue-camera";
import UploadService from "@/services/UploadService";
import { useAuthStore } from "@/stores/auth/User";

export default defineComponent({
  name: "AvatarPhoto",
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: 200,
    },
    icon: {
      type: String,
      default: "mdi-account",
    },
  },
  emits: ["update:modelValue"],
  components: {
    Camera,
  },
  setup(props, { emit }) {
    const dialogUpdate = ref(false);
    const uploading = ref(false);
    const upHere = ref(false);

    const camera = ref<InstanceType<typeof Camera> | null>(null);
    const inputUpload = ref<HTMLInputElement | null>(null);

    const uploadService = new UploadService();
    const authStore = useAuthStore();

    const currentAvatarUrl = ref(props.modelValue);

    watch(
      () => props.modelValue,
      (newValue) => {
        currentAvatarUrl.value = newValue;
      }
    );

    const capture = async () => {
      dialogUpdate.value = false;

      try {
        if (!camera.value) {
          throw new Error("Câmera não está disponível.");
        }

        const blob = await camera.value.snapshot({ width: 640, height: 480 });

        if (!blob) {
          throw new Error("Falha ao capturar a imagem.");
        }

        const imageFile = new File([blob], "image.jpg", { type: blob.type });
        uploading.value = true;

        const imageUrl = await uploadService.uploadImage(imageFile);

        if (imageUrl) {
          currentAvatarUrl.value = imageUrl;
          emit("update:modelValue", imageUrl);
        } else {
          throw new Error(
            "URL de avatar não encontrada na resposta do servidor."
          );
        }
      } catch (e: any) {
        console.error("Erro ao fazer upload da imagem:", e);
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          "Erro ao fazer upload da imagem. Tente novamente.";
        alert("Erro ao fazer upload da imagem: " + msg);
      } finally {
        uploading.value = false;
      }
    };

    const onUpload = async (e: Event) => {
      dialogUpdate.value = false;

      const files = (e.target as HTMLInputElement).files;
      if (!files || !files[0]) return;

      const imageFile = files[0];
      uploading.value = true;

      try {
        const imageUrl = await uploadService.uploadImage(imageFile);

        if (imageUrl) {
          currentAvatarUrl.value = imageUrl;
          emit("update:modelValue", imageUrl);
        } else {
          throw new Error(
            "URL de avatar não encontrada na resposta do servidor."
          );
        }
      } catch (e) {
        console.error("Erro ao fazer upload da imagem:", e);
        alert(
          "Erro ao fazer upload da imagem. Certifique-se de que a imagem tem menos de 2MB."
        );
      } finally {
        uploading.value = false;
      }
    };

    return {
      dialogUpdate,
      uploading,
      upHere,
      currentAvatarUrl,
      capture,
      onUpload,
      camera,
      inputUpload,
    };
  },
});
</script>
