/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

describe('Log in via OIDC', () => {
  const login = 'admin';
  const password = 'admin';
  const userIconBtnXPath = '//button[@id="user-icon-btn"]';

  const kcLogin = () => {
    cy.get('#kc-page-title').should('be.visible');
    cy.get('#username').type(login);
    cy.get('#password').type(password);
    cy.get('#kc-login').click();
  };

  const logout = () => {
    cy.xpath(userIconBtnXPath).should('be.visible', { timeout: 15000 });
    cy.xpath(userIconBtnXPath).click();
    cy.xpath('//*[@data-test-subj="log-out-/d"]').click();
    cy.get('#kc-page-title').should('be.visible');
  };

  afterEach(async () => {
    logout();
  });

  it('Login to app/opensearch_dashboards_overview#/ when OIDC is enabled', () => {
    cy.visit('http://localhost:5601/app/opensearch_dashboards_overview#/');

    kcLogin();

    cy.xpath('//*[@id="osdOverviewPageHeader__title"]').should('be.visible');

    cy.getCookie('security_authentication').should('exist');
    cy.clearCookies();
  });

  it('Login to app/dev_tools#/console when OIDC is enabled', () => {
    const requestButtonXPath = '//*[@data-test-subj="sendRequestButton"]';

    cy.visit('http://localhost:5601/app/dev_tools#/console');

    kcLogin();

    cy.xpath(requestButtonXPath).should('be.visible');

    cy.getCookie('security_authentication').should('exist');
    cy.clearCookies();
  });

  it('Login to Dashboard with Hash', () => {
    const headerXPath = '/html/body/div[1]/div/header/div/div[2]';

    cy.visit(
      `http://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d?_g=(filters:!(),refreshInterval:(pause:!f,value:900000),time:(from:now-24h,to:now))&_a=(description:'Analyze%20mock%20flight%20data%20for%20OpenSearch-Air,%20Logstash%20Airways,%20OpenSearch%20Dashboards%20Airlines%20and%20BeatsWest',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:''),timeRestore:!t,title:'%5BFlights%5D%20Global%20Flight%20Dashboard',viewMode:view)`
    );

    kcLogin();

    cy.xpath(headerXPath).should('be.visible');

    cy.getCookie('security_authentication').should('exist');
    cy.clearCookies();
  });

  it('Tenancy persisted after logout in OIDC', () => {
    cy.visit('http://localhost:5601/app/opensearch_dashboards_overview#/');

    kcLogin();

    cy.xpath('//*[@id="global"]').should('be.enabled');

    cy.xpath('//*[@id="global"]').click({ force: true });
    cy.xpath('//button[@data-test-subj="confirm"]').click();

    cy.xpath('//*[@id="osdOverviewPageHeader__title"]').should('be.visible');

    cy.xpath(userIconBtnXPath).should('be.visible', { timeout: 15000 });
    cy.xpath(userIconBtnXPath).click();
    cy.xpath('//*[@data-test-subj="log-out-2"]').click(); // TO DO: find out why the test ID changes and form a dynamic XPath for this case
    cy.get('#kc-page-title').should('be.visible');

    kcLogin();

    cy.xpath('//button[@data-test-subj="skipWelcomeScreen"]').click();

    cy.xpath(userIconBtnXPath).should('be.visible');
    cy.xpath(userIconBtnXPath).click();

    cy.get('#tenantName').should('have.text', 'Global');
  });
});
