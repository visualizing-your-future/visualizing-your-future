import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';

class DataInputPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.DATA_STUFF}`;
    this.pageSelector = Selector(this.pageId);

    // Selectors for the buttons
    this.importDataButton = Selector('#importDataButton');
    this.viewDataButton = Selector('#viewDataButton');
  }

  /* Asserts that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  // TODO: add a test to check that adding petty cash, cash, and bank cash works
  async addingCash() {
    // TODO: add code here
  }

  // TODO: add a test to check that removing petty cash, cash, and bank cash works
  async removingCash() {
    // TODO: add code here
  }
}

export const dataInputPage = new DataInputPage();
