import Http from "./Http";

export class PasswordService extends Http {
  constructor() {
    super("password");
  }

  async update(
    id: string,
    data: { current_password?: string; new_password: string }
  ) {
    return await this.patch(`/update/${id}`, data);
  }

  async generate(id: string) {
    return await this.patch(`/generate/${id}`, {});
  }
}
