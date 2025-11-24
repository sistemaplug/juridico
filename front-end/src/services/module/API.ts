import { Auth } from "../Auth";
import { PasswordService } from "../PasswordService";
import UploadService from "../UploadService";

export class API {
  static auth = new Auth();
  static uploadService = new UploadService();
  static passwordService = new PasswordService();
}
