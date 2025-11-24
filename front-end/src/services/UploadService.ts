import Http from "./Http";

class UploadService extends Http {
  constructor() {
    super("/users/auth");
  }

  async uploadImage(imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await this.post<{ url: string }>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.url) {
        return response.url;
      } else {
        throw new Error("A URL do avatar não foi retornada.");
      }
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw new Error("Erro ao fazer upload da imagem. Tente novamente.");
    }
  }
}

export default UploadService;
