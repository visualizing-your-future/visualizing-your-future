import { Selector, t } from 'testcafe';
import { addStuffPage, listStuffAdminPage, listStuffPage, editStuffPage, /* manageDatabasePage, */ signOutPage } from './simple.page';
import { landingPage } from './landing.page';
import { signInPage } from './signin.page';
import { signUpPage } from './signup.page';
import { homePage } from './home.page';
import { navBar } from './navbar.component';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
const newCredentialsAccountant = { username: 'jane@foo.com', password: 'changeme', accountType: 'Accountant', clientKey: '' };
const newCredentialsClient = { username: 'howdy@foo.com', password: 'changeme', accountType: 'Client', clientKey: 'EKIJTODS' };

fixture('meteor-application-template-production localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async () => {
  await landingPage.isDisplayed();
});

test('Test that signin and signout work', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that the home page can be navigated to and is functional', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoHomePage();
  await homePage.isDisplayed();
  await homePage.clickImportDataButton();
  await navBar.gotoHomePage();
  await homePage.clickViewDataButton();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that user pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoAddStuffPage();
  await addStuffPage.isDisplayed();
  await navBar.gotoListStuffPage();
  await listStuffPage.isDisplayed();
  // want to see if we can get to the editStuffPage
  const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
  await t.click(editLinks.nth(0));
  await editStuffPage.isDisplayed();
  // await navBar.gotoClientDataPage();
  // await clientDataPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that sign up for accountant and sign out work', async () => {
  await navBar.gotoSignUpPage();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(newCredentialsAccountant.username, newCredentialsAccountant.password, newCredentialsAccountant.accountType, newCredentialsAccountant.clientKey);
  await navBar.isLoggedIn(newCredentialsAccountant.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that sign up for client and sign out work', async () => {
  await navBar.gotoSignUpPage();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(newCredentialsClient.username, newCredentialsClient.password, newCredentialsClient.accountType, newCredentialsClient.clientKey);
  await navBar.isLoggedIn(newCredentialsClient.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that admin pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await navBar.gotoAddStuffPage();
  await addStuffPage.isDisplayed();
  await navBar.gotoListStuffPage();
  await listStuffPage.isDisplayed();
  // want to see if we can get to the editStuffPage
  const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
  await t.click(editLinks.nth(0));
  await editStuffPage.isDisplayed();
  await navBar.gotoListStuffAdminPage();
  await listStuffAdminPage.isDisplayed();
  // await navBar.gotoManageDatabasePage();
  // await manageDatabasePage.isDisplayed();
});
