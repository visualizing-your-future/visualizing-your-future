import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';

class AccountSettingsPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ACCOUNT_SETTINGS}`;
    this.pageSelector = Selector(this.pageId);

    // Selectors for the buttons
    this.importDataButton = Selector('#importDataButton');
    this.viewDataButton = Selector('#viewDataButton');
  }

  /* Asserts that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }
}

export const accountSettingsPage = new AccountSettingsPage();
