import BaseElement from '@/utils/elements/basic_element';
import { CLASS_NAMES } from '@/utils/types_variables/variables';
// import Hero from './hero_container/hero';

export default class ProfilePage extends BaseElement {
  constructor() {
    super({ tag: 'section', classes: [CLASS_NAMES.profile.profilePage] });
  }
}
