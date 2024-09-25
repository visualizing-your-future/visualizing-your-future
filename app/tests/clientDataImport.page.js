import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';

class ClientDataImportPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.CLIENT_DATA_IMPORT}`;
    this.pageSelector = Selector(this.pageId);

    // Selectors for the buttons
    this.importDataButton = Selector('#importDataButton');
    this.viewDataButton = Selector('#viewDataButton');
  }

  /* Asserts that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  // TODO: Change this to click the choose file button and import a file
  async clickImportDataButton() {
    await t
      .expect(this.importDataButton.exists).ok('Import Data button does not exist')
      .expect(this.importDataButton.visible).ok('Import Data button is not visible')
      .click(this.importDataButton);
  }
}

export const clientDataImportPage = new ClientDataImportPage();
