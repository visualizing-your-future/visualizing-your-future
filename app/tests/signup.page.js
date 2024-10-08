import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class SignUpPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.SIGN_UP}`;
    this.pageSelector = Selector(this.pageId);
    this.accountTypeAccountantSelector = Selector('#sign-up label').withText('Accountant');
    this.accountTypeClientSelector = Selector('#sign-up label').withText('Client');
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** Signs up a new user, then checks to see that they are logged in by checking the navbar. */
  async signupUser(username, password, accountType, company, clientKey) {
    if (accountType === 'Accountant') {
      await t.click(this.accountTypeAccountantSelector);
      await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_FIRST_NAME}`, 'Jane');
      await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_LAST_NAME}`, 'Doe');
    } else if (accountType === 'Client') {
      await t.click(this.accountTypeClientSelector);
      await t.wait(100);
      await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_COMPANY_NAME}`, company);
      await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_CLIENT_KEY}`, clientKey);
    }
    await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_EMAIL}`, username);
    await t.typeText(`#${COMPONENT_IDS.SIGN_UP_FORM_PASSWORD}`, password);

    await t.click(`#${COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} input.btn.btn-primary`);
  }
}

export const signUpPage = new SignUpPage();
