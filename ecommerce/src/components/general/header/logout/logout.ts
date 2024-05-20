import Anchor from '@/utils/elements/anchor';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import tokenCache from '@/utils/services/SDK/token_cache';
import { LocalStorage } from '@/utils/services/local_storage';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Logout extends Anchor {
  constructor() {
    super({ href: 'main', content: 'Log out', classes: [CLASS_NAMES.link, CLASS_NAMES.header.logout] });
    this.addListener('click', this.handleLogout);
  }

  handleLogout = () => {
    LocalStorage.clear();
    tokenCache.clear();
    sdk.apiRoot = sdk.clientMaker.createAnonymousClient();
    sdk.header.switchToUnauthorized();
  };
}
