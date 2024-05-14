import { ByProjectKeyRequestBuilder, MyCustomerDraft, MyCustomerSignin } from '@commercetools/platform-sdk';
import ClientMaker from './client_builder';
import { LocalStorage } from '../local_storage';
import tokenCache from './token_cache';

export default class SDKManager {
  apiRoot: ByProjectKeyRequestBuilder;

  clientMaker: ClientMaker = new ClientMaker();

  constructor() {
    const tokenData = LocalStorage.get('token-data');
    if (tokenData) {
      const token: string = tokenData.token;
      console.log(token);
      this.apiRoot = this.clientMaker.createExistingTokenClient(token);
    } else {
      this.apiRoot = this.clientMaker.createAnonymousClient();
    }
  }

  signup(userData: MyCustomerDraft) {
    this.apiRoot
      .me()
      .signup()
      .post({ body: userData })
      .execute()
      .then(() => {
        this.apiRoot = this.clientMaker.createPasswordClient(userData.email, userData.password);
        LocalStorage.save('token-data', { token: tokenCache.myCache.token });
      })
      .catch((error) => console.log(error));
  }

  login(userCredential: MyCustomerSignin) {
    this.apiRoot
      .me()
      .login()
      .post({ body: userCredential })
      .execute()
      .then(() => {
        this.apiRoot = this.clientMaker.createPasswordClient(userCredential.email, userCredential.password);
        LocalStorage.save('token-data', { token: tokenCache.myCache.token });
      })
      .catch((error) => console.log(error));
  }
}
