import {
  ByProjectKeyRequestBuilder,
  MyCustomerDraft,
  MyCustomerSignin,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import ClientMaker from './client_builder';
import { LocalStorage } from '../local_storage';
import { HttpErrorType } from '@commercetools/sdk-client-v2';

class SDKManager {
  apiRoot: ByProjectKeyRequestBuilder;

  clientMaker: ClientMaker = new ClientMaker();

  constructor() {
    const tokenData = LocalStorage.get('token-data');
    if (tokenData?.refreshToken) {
      this.apiRoot = this.clientMaker.createRefreshTokenClient(tokenData.refreshToken);
    } else {
      this.apiRoot = this.clientMaker.createAnonymousClient();
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

  login(userCredential: MyCustomerSignin) {
    let errorMessage: string = '';
    this.apiRoot
      .me()
      .login()
      .post({ body: userCredential })
      .execute()
      .then(() => {
        this.apiRoot = this.clientMaker.createPasswordClient(userCredential.email, userCredential.password);
      })
      .catch((error: HttpErrorType) => (errorMessage = error.message));
    return errorMessage;
  }

  logout() {
    this.apiRoot = this.clientMaker.createAnonymousClient();
    LocalStorage.clear();
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
