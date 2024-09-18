# Visualizing Your Future

## Overview
Visualizing Your Future is a graphical data presentation and financial forecasting web application created for Spire Hawaii LLP.

![CI](https://github.com/visualizing-your-future/visualizing-your-future/workflows/ci.yml/badge.svg)

Important functionalities include:
* Dynamically convert data into visual formats.
* Parse uploaded Excel sheet(s).
* Analyze data to provide 5-year financial forecasts.
* Save data for ease of access.

## Requirements
* <b>Nodejs 14.x.x</b>
  * [Download nvm (node version manager).](https://github.com/coreybutler/nvm-windows)
  * Open a command prompt and type the following:<br>
  `nvm install 14`<br>
  `nvm list`<br>
  `nvm use 14.x.x (whichever version was returned previously)`
  * Verify your version by typing the following:<br>
  `node -v`
* <b>npm 6.x.x</b>
  * This should have been installed by default when you installed Nodejs 14.x.x.
  * Verify your version by typing the following:<br>
  `npm -v`
* <b>Meteor 2.15.0</b>
  * Install meteor by typing the following:<br>
  `npm install -g meteor@2.15.0`
  * Verify your version by typing the following:<br>
  `meteor --version`

## Installation

### *** IMPORTANT ***<br><br>The default admin login is very weak.  We highly recommend creating a new admin account and deleting the default admin.
### Default admin account login:<br><br>`username: admin@foo.com`<br><br> `password: changeme`<br><br>

1) Clone this repository.
2) Open a command prompt.
3) Go into the "app" directory.<br>
`cd app`
4) Run the following command:<br>
`npm run start`<br>
"start" is a script that runs the following command:<br>
`meteor --no-release-check --exclude-archs web.browser.legacy,web.cordova --settings ../config/settings.development.json`
6) If you wish to revert to a clean install, type the following:<br>
`meteor reset`

## Uploading Excel Files
TODO once fully implemented.

## Inputting Data Manually
TODO once fully implemented.

## Viewing Data in a Graphical Format
TODO once fully implemented.

[![ci-meteor-application-template-production](https://github.com/ics-software-engineering/meteor-application-template-production/actions/workflows/ci.yml/badge.svg)](https://github.com/ics-software-engineering/meteor-application-template-production/actions/workflows/ci.yml)

For details, please see http://ics-software-engineering.github.io/meteor-application-template-production/
