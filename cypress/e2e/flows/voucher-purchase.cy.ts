import orderData from '../../fixtures/orderData.json'

describe('Voucher purchase flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/lessons/lessonsConfiguration', {
      fixture: 'lessons.json',
    }).as('getLessons')
    cy.intercept('GET', '/api/extras', {
      fixture: 'extras.json',
    }).as('getExtras')
    cy.intercept('GET', '/api/merch', {
      fixture: 'merch.json',
    }).as('getMerch')
    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      fixture: 'orderSuccess.json',
    }).as('submitOrder')
    cy.intercept('POST', '/api/voucher-generation-pdf', {
      statusCode: 200,
      body: {
        message: 'Voucher PDFs generated and email sent if applicable',
      },
    }).as('sendPDFVouchers')

    cy.setLargeViewport()
    cy.visit('/')
  })

  it('should complete voucher purchase with Merch and Videos selected', () => {
    cy.contains('Nemám, ale chci!').should('exist').click()
    cy.wait('@getLessons')
    cy.get('[data-cy="increment"]').should('exist').click()
    cy.get('[data-cy="amount"]').should('exist').should('contain', '1')
    cy.clickNextButton()
    cy.get('[data-cy="voucher-name-0"]').should('exist').type('Pro miláčka')
    cy.clickNextButton()
    cy.get('[data-cy="first_name"]').should('exist').type('Ekaterina')
    cy.get('[data-cy="last_name"]').should('exist').type('Melnichuk')
    cy.get('[data-cy="email"]')
      .should('exist')
      .type('katerinka.melnichuk@gmail.com')
    cy.get('[data-cy="phone_number"]').should('exist').type('+420775992148')
    cy.get('[data-cy="know_from"]').should('exist').select('Facebook')
    cy.clickNextButton()
    cy.wait('@getExtras')
    cy.contains('Záběry z lekce a selfie tyč Insta 360').click()
    cy.clickNextButton()
    cy.wait('@getMerch')
    cy.contains('Sluneční brýle').click()
    cy.clickNextButton()
    cy.checkOrderDetails()
    cy.contains('button', 'Dokončit a zaplatit').click()
    cy.wait('@submitOrder').then(interception => {
      expect(interception.request.body.order_data.customer).to.deep.equal(
        orderData.order_data.customer,
      )
      expect(interception.request.body.order_data.order_type).to.equal(
        'voucher',
      )
      expect(interception.request.body.order_data.merch[0]).to.deep.equal(
        orderData.order_data.merch[0],
      )
      expect(interception.request.body.order_data.lessonType[0]).to.deep.equal(
        orderData.order_data.lessonType[0],
      )
      cy.wait('@sendPDFVouchers')
    })
    cy.get('[data-cy="checkout-table"]').should('exist')
    cy.get('[data-cy="account-number"]').should('have.text', '2599883943/0300')
    cy.get('[data-cy="variable-symbol"]').should('have.text', '2000856')
    cy.get('[data-cy="qr-code"]').should('exist')

    // TODO test stripe payment
  })
})
