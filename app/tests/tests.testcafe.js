import { signOutPage } from './simple.page';
import { landingPage } from './landing.page';
import { signInPage } from './signin.page';
import { signUpPage } from './signup.page';
import { navBar } from './navbar.component';
import { clientDataImportPage } from './clientDataImport.page';
import { dataInputPage } from './dataInput.page';
import { visualizationPage } from './visualization.page';
import { adminPage } from './admin.page';
import { allProfilesPage } from './allProfiles.page';
import { manageDatabasePage } from './manageDatabase.page';
import { accountSettingsPage } from './accountSettings.page';

/* global fixture:false, test:false */
/* run command : npm run test-acceptance-development
* build runs : meteor npm run test-acceptance-ci */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
const newCredentialsAccountant = { username: 'jane@foo.com', password: 'changeme', accountType: 'Accountant', clientKey: '' };
const newCredentialsClient = { username: 'jakes@foo.com', password: 'changeme', accountType: 'Client', company: 'JakesGoods', clientKey: 'CLIENTKEY' };

fixture('meteor-application-template-production localhost test with default db')
  .page('http://localhost:3000');

// TEST PASSED
test('Test that landing page shows up and button works', async () => {
  await landingPage.isDisplayed();
  // await landingPage.clickLearnMoreButton();
  // await signInPage.isDisplayed();
});

// TEST PASSED
test.only('Test that signin and signout pages work', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

// PASSED TEST
test('Test that sign up for accountant and sign out work', async () => {
  await navBar.gotoSignUpPage();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(newCredentialsAccountant.username, newCredentialsAccountant.password, newCredentialsAccountant.accountType);
  await navBar.isLoggedIn(newCredentialsAccountant.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

// NOTE: Skip test for now
// TODO: Add company name to user accounts for clients to make this test work correctly
test.skip('Test that sign up for client and sign out work', async () => {
  await navBar.gotoSignUpPage();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(
    newCredentialsClient.username,
    newCredentialsClient.password,
    newCredentialsClient.accountType,
    newCredentialsClient.company,
    newCredentialsClient.clientKey,
  );
  await navBar.isLoggedIn(newCredentialsClient.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

// TEST PASSED
test('Test that all navbar page links for role User works', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await landingPage.isDisplayed();
  // TODO: Check that the correct welcomes for user is being shown
  await navBar.gotoDataInputPage();
  await dataInputPage.isDisplayed();
  await navBar.gotoClientDataImportPage();
  await clientDataImportPage.isDisplayed();
  await navBar.gotoVisualizationPage();
  await visualizationPage.isDisplayed();
  await navBar.gotoAccountSettingsPage();
  await accountSettingsPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

// PASSED TEST
test('Test that all navbar links specific to role admin works', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await landingPage.isDisplayed();
  // TODO: Check that the correct welcome for admin is being shown
  await navBar.gotoAdminPage();
  await adminPage.isDisplayed();
  await navBar.gotoAllProfilesPage();
  await allProfilesPage.isDisplayed();
  await navBar.gotoManageDatabasePage();
  await manageDatabasePage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

// FIX!!! This should be working
test('Test that the home page can be navigated to and is functional', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await landingPage.isDisplayed();
  await landingPage.clickImportDataButton();
  await clientDataImportPage.isDisplayed();
  await navBar.gotoLandingPage();
  await landingPage.clickViewDataButton();
  await dataInputPage.isDisplayed();
  await navBar.gotoLandingPage();
  await landingPage.clickClientProjectionsButton();
  await visualizationPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test.skip('Tests functionality of data input page', async () => {
// TODO: later on, add code here
});

test.skip('Tests edit user page for each role/account type', async () => {
// TODO: later on, add code here
  // TODO: accountant
  // TODO: client
  // TODO: admin
});
