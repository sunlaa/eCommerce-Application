import Anchor from '@/utils/elements/anchor';
import { sdk } from '@/utils/services/SDK/sdk_manager';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Logout extends Anchor {
  constructor() {
    super({ href: '#main', content: 'Log out', classes: [CLASS_NAMES.link, CLASS_NAMES.header.logout] });
    this.addListener('click', this.handleLogout);
  }

  handleLogout = () => {
    sdk.logout();
  };
}
