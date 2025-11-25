import { AddressService } from "../addresses/AddressService";
import { Auth } from "../Auth";
import { ContractorService } from "../contractors/ContractorService";
import { ContractService } from "../contracts/ContractService";
import { PasswordService } from "../PasswordService";
import { ProcessContactService } from "../process-contacts/ProcessContactService";
import UploadService from "../UploadService";

export class API {
  static auth = new Auth();
  static uploadService = new UploadService();
  static passwordService = new PasswordService();
  static contractorService = new ContractorService();
  static contractService = new ContractService();
  static processContactService = new ProcessContactService();
  static addressService = new AddressService();
}
