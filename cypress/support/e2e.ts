// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Block external requests
beforeEach(() => {
  cy.intercept('https://www.google-analytics.com/**', { statusCode: 204 }).as(
    'gaBlock',
  )
  cy.intercept('https://*.sentry.io/**', { statusCode: 204 }).as('sentryBlock')
  cy.intercept('https://*.ingest.sentry.io/**', { statusCode: 204 }).as(
    'sentryIngestBlock',
  )
})
