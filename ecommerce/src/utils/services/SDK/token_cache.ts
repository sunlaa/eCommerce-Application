import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';
import { LocalStorage } from '../local_storage';

class MyTokenCache implements TokenCache {
  myCache: TokenStore = { token: '', expirationTime: 0, refreshToken: undefined };

  set(newCache: TokenStore) {
    console.log('hello');
    Object.assign(this.myCache, newCache);
    LocalStorage.save('token-data', this.myCache);
    console.log(this.myCache);
  }

  get(): TokenStore {
    return this.myCache;
  }
}

const tokenCache = new MyTokenCache();

export default tokenCache;
