import { Auth } from "../Auth";
import { ContractorService } from "../contractors/ContractorService";
import { ContractService } from "../contracts/ContractService";
import { PasswordService } from "../PasswordService";
import UploadService from "../UploadService";

export class API {
  static auth = new Auth();
  static uploadService = new UploadService();
  static passwordService = new PasswordService();
  static contractorService = new ContractorService();
  static contractService = new ContractService();
}
