import { AddressService } from "../addresses/AddressService";
import { Auth } from "../Auth";
import { ContractorService } from "../contractors/ContractorService";
import { ContractService } from "../contracts/ContractService";
import { PasswordService } from "../PasswordService";
import { PersonService } from "../persons/PersonService";
import { ProcessContactPersonService } from "../process-contacts-person/ProcessContactPersonService";
import { RequiererService } from "../requirers/RequiererService";
import { Service } from "../services-contractors/ServiceContractorService";
import { TrelloLinkService } from "../trello-links/TrelloLinkService";
import UploadService from "../UploadService";

export class API {
  static auth = new Auth();
  static uploadService = new UploadService();
  static passwordService = new PasswordService();
  static personService = new PersonService();
  static contractorService = new ContractorService();
  static contractService = new ContractService();
  static processContactPersonService = new ProcessContactPersonService();
  static addressService = new AddressService();
  static requirerService = new RequiererService();
  static service = new Service();
  static trelloLinkService = new TrelloLinkService();
}
