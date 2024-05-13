import Anchor from '@/utils/elements/anchor';
import { CLASS_NAMES } from '@/utils/types_variables/variables';

export default class Logout extends Anchor {
  constructor() {
    super({ href: '#main', content: 'Log out', classes: [CLASS_NAMES.link, CLASS_NAMES.header.logout] });
    this.addListener('click', this.handleLogout);
  }

  handleLogout = () => {
    // Серверная обработка выхода
  };
}
