import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';
import { LocalStorage } from '../local_storage';

class MyTokenCache implements TokenCache {
  myCache: TokenStore = { token: '', expirationTime: 0, refreshToken: undefined };

  set(newCache: TokenStore) {
    Object.assign(this.myCache, newCache);
    LocalStorage.save('token-data', this.myCache);
  }

  get(): TokenStore {
    return this.myCache;
  }

  clear() {
    this.myCache = { token: '', expirationTime: 0, refreshToken: undefined };
  }
}

const tokenCache = new MyTokenCache();

export default tokenCache;
