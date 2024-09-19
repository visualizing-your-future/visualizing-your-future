import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class LandingPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.LANDING}`;
    this.pageSelector = Selector(this.pageId);
    this.importDataButton = Selector('#importDataButton');
    this.viewDataButton = Selector('#viewDataButton');
    this.clientProjectionsButton = Selector('#clientProjectionsButton');
    this.welcomeUser = `#${COMPONENT_IDS.LANDING_USER}`;
    this.welcomeAdmin = `#${COMPONENT_IDS.LANDING_ADMIN}`;
  }

  /* Asserts that this page is currently displayed. */
  async isDisplayed() {
    // From https://testcafe.io/documentation/402803/recipes/best-practices/create-helpers
    // Note that this file imports t (the test controller) from the testcafe module. You don’t need to pass t to helper functions because TestCafe can resolve the current test context and provide the correct test controller instance.
    await t.expect(this.pageSelector.exists).ok();
  }

  async clickLearnMoreButton() {
    await t.click(this.button);
  }

  async visibleWelcomeUser() {
    await t.expect(this.welcomeUser.visible).ok('User Welcome is not visible');
  }

  async visibleWelcomeAdmin() {
    await t.expect(this.welcomeAdmin.visible).ok('Admin Welcome is not visible');
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

  // Click "Client's Projections" button
  async clickClientProjectionsButton() {
    await t
      .expect(this.clientProjectionsButton.exists).ok('Client Projections button does not exist')
      .expect(this.clientProjectionsButton.visible).ok('Client Projections button is not visible')
      .click(this.clientProjectionsButton);
  }
}

export const landingPage = new LandingPage();
