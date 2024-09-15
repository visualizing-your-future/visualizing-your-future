import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';

class HomePage {
  constructor() {
    this.pageId = `#${PAGE_IDS.HOME}`;
    this.pageSelector = Selector(this.pageId);

    // Selectors for the buttons
    this.importDataButton = Selector('#importDataButton');
    this.viewDataButton = Selector('#viewDataButton');
  }

  /* Asserts that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  // CLick "Import Data" button
  async clickImportDataButton() {
    await t
      .expect(this.importDataButton.exists).ok('Import Data button does not exist')
      .expect(this.importDataButton.visible).ok('Import Data button is not visible')
      .click(this.importDataButton);
  }

  // Click "View Financials" button
  async clickViewDataButton() {
    await t
      .expect(this.viewDataButton.exists).ok('View Data button does not exist')
      .expect(this.viewDataButton.visible).ok('View Data button is not visible')
      .click(this.viewDataButton);
  }
}

export const homePage = new HomePage();
