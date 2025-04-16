/// <reference types="cypress" />

import 'cypress-plugin-stripe-elements'
import { layoutSelectors } from './selectors'

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('setLargeViewport', () => {
  cy.viewport(1280, 800)
})

Cypress.Commands.add('clickNextButton', () => {
  cy.contains(layoutSelectors.nextButton).should('be.enabled').click()
})

Cypress.Commands.add('checkOrderDetails', () => {
  cy.contains('Ekaterina Melnichuk')
  cy.contains('katerinka.melnichuk@gmail.com')
  cy.contains('+420775992148')
  cy.contains('Pro miláčka')
  cy.contains('Doporučená lekce')
  cy.contains('Záběry z lekce a selfie tyč Insta 360')
  cy.contains('Sluneční brýle')
  cy.contains('3 197,10 CZK')
})

Cypress.Commands.add('fillInStripeCardDetails', () => {
  cy.get('[data-cy="card-element"]').within(() => {
    cy.fillElementsInput('cardNumber', '4242424242424242')
    cy.fillElementsInput('cardExpiry', '1025')
    cy.fillElementsInput('cardCvc', '123')
    cy.fillElementsInput('postalCode', '90210')
  })
})
