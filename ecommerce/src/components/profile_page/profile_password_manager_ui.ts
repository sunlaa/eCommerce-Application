import BaseElement from '@/utils/elements/basic_element';
import Form from '@/utils/elements/form';
import Input from '@/utils/elements/input';
import InputField from '@/utils/elements/input_field';
import { CLASS_NAMES, TEXT_CONTENT } from '@/utils/types_variables/variables';

export default class ProfilePasswordManager extends Form {
  passForm: ProfilePasswordManager;

  constructor(profileSumCont: BaseElement) {
    super({
      classes: [CLASS_NAMES.profile.profilePasswordForm],
    });

    this.spawnInputs();

    this.passForm = this;
    this.passForm.element.setAttribute('novalidate', '');
    profileSumCont.appendChildren(this.passForm);
  }

  spawnInputs() {
    TEXT_CONTENT.profilePasswordManager.passwordFormLabels.forEach((labelName, elementIndex) => {
      const currentElement = new InputField([CLASS_NAMES.profile.passwordFieldsCont], {
        label: { content: labelName },
        input: {
          name: TEXT_CONTENT.profilePasswordManager.passwordFormNames[elementIndex],
          type: 'password',
          placeholder: TEXT_CONTENT.profilePasswordManager.passwordFormPH[elementIndex],
        },
        error: { classes: [CLASS_NAMES.formError] },
      });

      this.append(currentElement);
      this.inputFields.push(currentElement);
    });

    this.append(new Input({ value: TEXT_CONTENT.profileSaveBtn, type: 'submit' }));
  }
}
