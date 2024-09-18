import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';

class AdminPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADMIN}`;
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

export const adminPage = new AdminPage();
