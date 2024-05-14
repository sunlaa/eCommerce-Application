import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

class MyTokenCache implements TokenCache {
  myCache: TokenStore = { token: '', expirationTime: 0 };

  set(newCache: TokenStore) {
    this.myCache = newCache;
  }

  get() {
    return this.myCache;
  }
}

const tokenCache = new MyTokenCache();

export default tokenCache;
