import './commands'

declare global {
  namespace Cypress {
    interface Chainable {
      setLargeViewport(): Chainable<void>
      clickNextButton(): Chainable<void>
      checkOrderDetails(): Chainable<void>
      fillInStripeCardDetails(): Chainable<void>
    }
  }
}
