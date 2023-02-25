/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

describe('Log in via OIDC', () => {
  const login = 'admin';
  const password = 'admin';
  const pageTitleXPath = '//*[@id="osdOverviewPageHeader__title"]';

  afterEach(async () => {
    cy.get('#actionsMenu').click();
    cy.get('span').contains('Log out').click();
    cy.get('#kc-page-title').should('be.visible');
  });

  it('Login to app/opensearch_dashboards_overview#/ when OIDC is enabled', () => {
    cy.visit('http://localhost:5601/app/opensearch_dashboards_overview#/');
    cy.get('#kc-page-title').should('be.visible');
    cy.get('#username').type(login);
    cy.get('#password').type(password);
    cy.get('#kc-login').click();

    cy.xpath(pageTitleXPath).should('be.visible');

    cy.getCookie('security_authentication').should('exist');
    cy.clearCookies();
  });

  it('Login to app/dev_tools#/console when OIDC is enabled', () => {
    const requestButtonXPath = '//*[@data-test-subj="sendRequestButton"]';

    cy.visit('http://localhost:5601/app/dev_tools#/console');
    cy.get('#kc-page-title').should('be.visible');
    cy.get('#username').type(login);
    cy.get('#password').type(password);
    cy.get('#kc-login').click();

    cy.xpath(requestButtonXPath).should('be.visible');

    cy.getCookie('security_authentication').should('exist');
    cy.clearCookies();
  });

  it('Login to Dashboard with Hash', () => {
    const headerXPath = '/html/body/div[1]/div/header/div/div[2]';

    cy.visit(
      `http://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d?_g=(filters:!(),refreshInterval:(pause:!f,value:900000),time:(from:now-24h,to:now))&_a=(description:'Analyze%20mock%20flight%20data%20for%20OpenSearch-Air,%20Logstash%20Airways,%20OpenSearch%20Dashboards%20Airlines%20and%20BeatsWest',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:''),timeRestore:!t,title:'%5BFlights%5D%20Global%20Flight%20Dashboard',viewMode:view)`
    );
    cy.get('#kc-page-title').should('be.visible');
    cy.get('#username').type(login);
    cy.get('#password').type(password);
    cy.get('#kc-login').click();

    cy.xpath(headerXPath).should('be.visible');

    cy.getCookie('security_authentication').should('exist');
    cy.clearCookies();
  });

  it('Tenancy persisted after Logout in SAML', () => {
    cy.visit('http://localhost:5601/app/opensearch_dashboards_overview#/');
    cy.get('#kc-page-title').should('be.visible');
    cy.get('#username').type(login);
    cy.get('#password').type(password);
    cy.get('#kc-login').click();

    // work in progress
  });
});
