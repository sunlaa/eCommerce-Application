import {
  ByProjectKeyRequestBuilder,
  Customer,
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
import { ErrorProps } from '@/utils/types_variables/types';

export class SDKManager {
  header: Header;

  apiRoot: ByProjectKeyRequestBuilder;

  clientMaker: ClientMaker = new ClientMaker();

  isProfileLastPage: boolean = false;

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

    if (!this.isProfileLastPage) {
      this.header.switchToUnauthorized();
      this.isProfileLastPage = false;
    }
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
    let customerData: Customer | string | null = null;
    await this.apiRoot
      .me()
      .post({ body: { version, actions } })
      .execute()
      .then((response) => (customerData = response.body))
      .catch((err) => (customerData = ((err as Response).body as unknown as ErrorProps).message));

    return customerData;
  }

  async updatePassword(currentPassword: string, newPassword: string) {
    const version = await this.getCustomerVersion();
    const output = {
      email: '',
      error: '',
    };

    await this.apiRoot
      .me()
      .password()
      .post({ body: { version, currentPassword, newPassword } })
      .execute()
      .then((response) => {
        output.email = response.body.email;
      })
      .catch((err) => (output.error = ((err as Response).body as unknown as ErrorProps).message));

    return output;
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

  async getProductWithFilters(
    filter: string[],
    offset?: number,
    limit = NUMERIC_DATA.offset,
    sort: string = 'id asc',
    search: string = ''
  ) {
    try {
      const data = await this.apiRoot
        .productProjections()
        .search()
        .get({
          queryArgs: {
            filter,
            limit,
            offset,
            sort: [sort],
            'text.en': [search],
            fuzzy: true,
          },
        })
        .execute();

      const { body } = data;
      return body;
    } catch (err) {
      console.log(err);
    }
  }
}

export const sdk = new SDKManager();
