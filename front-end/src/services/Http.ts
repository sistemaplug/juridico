import { useAuthStore } from "@/stores/auth/User";
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// Configurações globais do Axios
axios.defaults.timeout = 24 * 60 * 60 * 1000; // Tempo limite de 24 horas
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

interface HttpConfig extends AxiosRequestConfig {
  headers?: Record<string, string>;
}

class Http {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  private get HTTP_CONFIG(): HttpConfig {
    const token = localStorage.getItem("@system_plug_juridico.access_token");
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  }
  // protected handleSessionExpired(): void {
  //   const authStore = useAuthStore();
  //   authStore.logout();
  // }
  protected handleSessionExpired(): void {
    const authStore = useAuthStore();
    authStore.logout(true); // passa flag dizendo que é expiração
  }

  private checkExpires(error: AxiosError): void {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      (error.response.data as any).message === "Unauthorized"
    ) {
      this.handleSessionExpired();
    }
  }

  private buildPath(subPath: string): string {
    return this.path + (subPath.startsWith("/") ? subPath : `/${subPath}`);
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      this.checkExpires(error);
    }
    console.error("Erro na requisição HTTP:", error);
    throw error;
  }

  async post<T>(
    path: string,
    body: unknown,
    options: HttpConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(
        this.buildPath(path),
        body,
        {
          headers: {
            ...this.HTTP_CONFIG.headers,
            ...options.headers,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async get<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(this.buildPath(path), {
        headers: this.HTTP_CONFIG.headers,
        params,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async patch<T>(
    path: string,
    body: unknown,
    options: HttpConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.patch(
        this.buildPath(path),
        body,
        {
          headers: {
            ...this.HTTP_CONFIG.headers, // mantém headers padrão (JSON, token, etc.)
            ...options.headers, // permite sobrescrever quando necessário
          },
          params: options.params,
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T>(path: string = ""): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.delete(
        this.buildPath(path),
        {
          headers: this.HTTP_CONFIG.headers,
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}

export default Http;
