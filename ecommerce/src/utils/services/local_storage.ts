import { TokenStore } from '@commercetools/sdk-client-v2';
import nonNullable from '../functions/non_nullable';

export class LocalStorage {
  static save(key: string, data: TokenStore) {
    const JSONdata = JSON.stringify(data);
    window.localStorage.setItem(key, JSONdata);
  }

  static get(key: string): TokenStore | null {
    const data = localStorage.getItem(key);
    if (nonNullable(data)) {
      const parseData = JSON.parse(data) as TokenStore;
      return parseData;
    }

    return null;
  }

  static clear() {
    window.localStorage.clear();
  }
}
