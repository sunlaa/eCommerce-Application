import {
  ByProjectKeyRequestBuilder,
  MyCustomerDraft,
  MyCustomerSignin,
  MyCustomerUpdateAction,
  ProductType,
} from '@commercetools/platform-sdk';
import ClientMaker from './client_builder';
import { LocalStorage } from '../local_storage';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import { NUMERIC_DATA, SERVER_ERROR_MSG } from '@/utils/types_variables/variables';
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

  async getProductTypeById(productTypeId: string): Promise<ProductType> {
    const productType = await this.apiRoot.productTypes().withId({ ID: productTypeId }).get().execute();
    return productType.body;
  }

  async getCustomerData() {
    try {
      const data = await this.apiRoot.me().get().execute();

      return data.body;
    } catch {
      return null;
    }
  }

  async getCategories() {
    const allCategories = await this.apiRoot.categories().get().execute();
    return allCategories.body.results;
  }

  async checkIfCategoryExist(key: string) {
    try {
      await this.apiRoot.categories().withKey({ key }).head().execute();
    } catch (err) {
      throw new Error('Key not found');
    }
  }

  async getProductByKey(key: string) {
    try {
      const { body } = await this.apiRoot.products().withKey({ key }).get().execute();
      return body;
    } catch (err) {
      console.log(err);
    }
  }

  async getProductWithFilters(filters: string[], offset: number) {
    try {
      const data = await this.apiRoot
        .productProjections()
        .search()
        .get({
          queryArgs: {
            filter: filters,
            limit: NUMERIC_DATA.offset,
            offset,
            sort: ['id asc'],
          },
        })
        .execute();

      if (data.body.total) {
        if (data.body.total < offset) {
          throw Error;
        }
      }
      const { results } = data.body;
      return results;
    } catch (err) {
      throw Error;
    }
  }
}

export const sdk = new SDKManager();
