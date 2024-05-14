import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';
import { LocalStorage } from '../local_storage';

class MyTokenCache implements TokenCache {
  myCache: TokenStore = { token: '', expirationTime: 0, refreshToken: undefined };

  set(newCache: TokenStore) {
    Object.assign(this.myCache, newCache);
    LocalStorage.save('token-data', { token: this.myCache.token });
    console.log(this.myCache);
  }

  get(): TokenStore {
    return this.myCache;
  }
}

const tokenCache = new MyTokenCache();

export default tokenCache;
