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
import tokenCache from './token_cache';

export class SDKManager {
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
    try {
      await this.apiRoot.me().signup().post({ body: userData }).execute();
      this.apiRoot = this.clientMaker.createPasswordClient(userData.email, userData.password);
      return '';
    } catch (err) {
      const error = err as HttpErrorType;
      return error.message;
    }
  }

  async login(userCredential: MyCustomerSignin) {
    const errorMessage = await this.isEmailExist(userCredential.email);
    if (errorMessage.length === 0) {
      try {
        await this.apiRoot.me().login().post({ body: userCredential }).execute();
        this.apiRoot = this.clientMaker.createPasswordClient(userCredential.email, userCredential.password);
      } catch (err) {
        const error = err as HttpErrorType;
        if (error.statusCode === 400) {
          return SERVER_ERROR_MSG.password;
        }
      }
    }
    return errorMessage;
  }

  async isEmailExist(email: string) {
    try {
      const { body } = await this.apiRoot
        .customers()
        .get({ queryArgs: { where: `email="${email}"` } })
        .execute();
      if (body.results.length === 0) {
        return SERVER_ERROR_MSG.email;
      }
      return '';
    } catch {
      return '';
    }
  }

  logout() {
    LocalStorage.clear();
    tokenCache.clear();
    this.apiRoot = sdk.clientMaker.createAnonymousClient();
    this.header.switchToUnauthorized();
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
