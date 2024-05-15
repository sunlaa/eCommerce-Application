import { ByProjectKeyRequestBuilder, MyCustomerDraft, MyCustomerSignin } from '@commercetools/platform-sdk';
import ClientMaker from './client_builder';
import { LocalStorage } from '../local_storage';
import { HttpErrorType } from '@commercetools/sdk-client-v2';

export default class SDKManager {
  apiRoot: ByProjectKeyRequestBuilder;

  clientMaker: ClientMaker = new ClientMaker();

  constructor() {
    const tokenData = LocalStorage.get('token-data');
    if (tokenData?.refreshToken) {
      this.apiRoot = this.clientMaker.createRefreshTokenClient(tokenData.refreshToken);
      this.apiRoot
        .get()
        .execute()
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      this.apiRoot = this.clientMaker.createAnonymousClient();
    }
  }

  signup(userData: MyCustomerDraft) {
    let errorMessage: string = '';
    this.apiRoot
      .me()
      .signup()
      .post({ body: userData })
      .execute()
      .then(() => {
        console.log(userData.email, userData.password);
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

  getAddressesID() {
    const addresesID: string[] = [];
    this.apiRoot
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
}
