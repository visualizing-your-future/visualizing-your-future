import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';

class AllProfilesPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.LIST_PROFILES}`;
    this.pageSelector = Selector(this.pageId);

    // Selectors for the buttons
    this.importDataButton = Selector('#importDataButton');
    this.viewDataButton = Selector('#viewDataButton');
  }

  /* Asserts that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  // TODO: Add Test To click edit and remove profiles (& add if we implement that)
}

export const allProfilesPage = new AllProfilesPage();
