import nonNullable from '../functions/non_nullable';
import { LocalData } from '../types_variables/types';

export class LocalStorage {
  static save(key: string, data: LocalData) {
    const JSONdata = JSON.stringify(data);
    window.localStorage.setItem(key, JSONdata);
  }

  static get(key: string): LocalData | null {
    const data = localStorage.getItem(key);
    if (nonNullable(data)) {
      const parseData = JSON.parse(data) as LocalData;
      return parseData;
    }

    return null;
  }

  static clear() {
    window.localStorage.clear();
  }
}
