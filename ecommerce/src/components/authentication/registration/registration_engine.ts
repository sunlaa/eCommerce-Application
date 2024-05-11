import { CLASS_NAMES } from '@/utils/types_variables/variables';
import FormValidation from '../validation_engine';
import RegFormUi from './registration_ui';

export default class RegFormEngine extends RegFormUi {
  container: HTMLElement = document.body; //изменить на main
  formReg: RegFormUi = new RegFormUi();
  validInstance: FormValidation = new FormValidation();

  constructor() {
    super();
  }

  regFormEngineStart() {
    this.container.append(this.formReg.element);

    this.regFormGeneral();
    this.checkboxEngine();
  }

  regFormGeneral() {
    const regBtn = this.formReg.getSubmitBtn()!.querySelector('input');
    if (!regBtn) return;

    regBtn.addEventListener('click', () => {
      this.validInstance.validate(this.formReg);
    });

    this.formReg.element.addEventListener('submit', (event) => {
      event.preventDefault();
      // send data
    });
  }

  checkboxEngine() {
    const checkbox = this.formReg.getCheckBox()!.querySelector('input');
    const billAddressCont = this.formReg.element.querySelector(`.${CLASS_NAMES.regFormAdressBill}`) as HTMLElement;
    const selectBillInput = billAddressCont.querySelector('select') as HTMLSelectElement;
    const billAddressInputs = [...billAddressCont.querySelectorAll('input'), selectBillInput];
    if (!checkbox) return;

    checkbox.addEventListener('input', (event) => {
      const checkboxElement = event.target as HTMLInputElement;
      billAddressInputs.forEach((billAdressInput) => {
        if (checkboxElement.checked) {
          billAdressInput.setAttribute('disabled', '');
        } else {
          billAdressInput.removeAttribute('disabled');
        }
      });
    });
  }
}
