import {
  ByProjectKeyRequestBuilder,
  MyCustomerDraft,
  MyCustomerSignin,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import ClientMaker from './client_builder';
import { LocalStorage } from '../local_storage';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import { SERVER_ERROR_MSG } from '@/utils/types_variables/variables';
import Header from '@/components/general/header/header';
import Router from '../routing';

class SDKManager {
  header: Header;

  apiRoot: ByProjectKeyRequestBuilder;

  clientMaker: ClientMaker = new ClientMaker();

  constructor() {
    this.header = new Header();
    const tokenData = LocalStorage.get('token-data');
    if (tokenData?.refreshToken) {
      this.apiRoot = this.clientMaker.createRefreshTokenClient(tokenData.refreshToken);
      document.body.append(this.header.switchToAuthorized());
    } else {
      this.apiRoot = this.clientMaker.createAnonymousClient();
      document.body.append(this.header.switchToUnauthorized());
    }
  }

  async signup(userData: MyCustomerDraft) {
    let errorMessage: string = '';
    await this.apiRoot
      .me()
      .signup()
      .post({ body: userData })
      .execute()
      .then(() => {
        this.apiRoot = this.clientMaker.createPasswordClient(userData.email, userData.password);
      })
      .catch((error: HttpErrorType) => (errorMessage = error.message));
    return errorMessage;
  }

  async login(userCredential: MyCustomerSignin) {
    let errorMessage: string = '';
    await this.apiRoot
      .customers()
      .get({ queryArgs: { where: `email="${userCredential.email}"` } })
      .execute()
      .then(({ body }) => {
        if (body.results.length === 0) {
          errorMessage = SERVER_ERROR_MSG.email;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (errorMessage.length === 0) {
      await this.apiRoot
        .me()
        .login()
        .post({ body: userCredential })
        .execute()
        .then(() => {
          this.apiRoot = this.clientMaker.createPasswordClient(userCredential.email, userCredential.password);
        })
        .catch((error: HttpErrorType) => {
          if (error.statusCode === 400) {
            errorMessage = SERVER_ERROR_MSG.password;
          }
        });
    }

    return errorMessage;
  }

  logout() {
    this.apiRoot = this.clientMaker.createAnonymousClient();
    LocalStorage.clear();
    Router.navigateTo('main');
  }

  async getAddressesID() {
    const addresesID: string[] = [];
    await this.apiRoot
      .me()
      .get()
      .execute()
      .then(({ body }) => {
        body.addresses.forEach((address) => {
          if (address.id) {
            addresesID.push(address.id);
          }
        });
      })
      .catch((err) => console.log(err));
    return addresesID;
  }

  async getCustomerVersion() {
    let version: number = NaN;

    await this.apiRoot
      .me()
      .get()
      .execute()
      .then(({ body }) => {
        version = body.version;
      })
      .catch((err) => console.log(err));

    return version;
  }

  async updateCustomer(actions: MyCustomerUpdateAction[]) {
    const version = await this.getCustomerVersion();
    await this.apiRoot
      .me()
      .post({ body: { version, actions } })
      .execute()
      .catch((err) => console.log(err));
  }
}

export const sdk = new SDKManager();
