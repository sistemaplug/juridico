import Http from "./Http";
import axios from "axios";
import type { DataUser } from "@/types/UserTypes";

interface LoginData {
  email: string;
  password: string;
  recaptchaToken: string;
}

export class Auth extends Http {
  constructor() {
    super("/users/auth");
  }

  async login(
    data: LoginData
  ): Promise<{ message: string; accessToken?: string }> {
    return await this.post("/login", data);
  }

  async blockUserByEmail(data: { email: string }) {
    return await this.post("/block-email", data);
  }

  async profile(): Promise<DataUser> {
    return await this.get<DataUser>("/profile");
  }

  async updateProfile(data: Partial<DataUser>): Promise<DataUser> {
    return await this.patch<DataUser>("/profile", data);
  }

  async updateAvatar(data: { url: string }): Promise<DataUser> {
    return this.patch("/avatar", data);
  }

  async updatePassword(data: { new_password: string }): Promise<void> {
    return this.patch("/password", data);
  }

  async logout(): Promise<void> {
    try {
      await this.post("/logout", {});
      localStorage.removeItem("@system_plug_juridico.access_token");
      delete axios.defaults.headers.Authorization;
    } catch (error) {
      throw error;
    }
  }
}
