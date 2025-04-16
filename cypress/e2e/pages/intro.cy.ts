describe('Intro screen', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the Intro screen with correct titles', () => {
    cy.get('[data-cy=title]')
      .should('exist')
      .should('have.text', 'Máte voucher s Flyboardshow?')

    cy.get('[data-cy=subtitle]')
      .should('exist')
      .should('have.text', 'Lekce na Flyboardu s profesionálními letci')
  })

  it('renders "Have voucher" tile (=option button), which leads to reservation URL after the click', () => {
    cy.contains('Mám voucher').click()

    cy.url().should('include', '/rezervace')
    cy.get('[data-cy=title]')
      .should('exist')
      .should('have.text', 'Kód voucheru')
  })

  it('renders "I want voucher" tile (=option button), which leads to voucher purchase URL after the click', () => {
    cy.contains('Nemám, ale chci!').click()

    cy.url().should('include', '/nakup-voucheru')
    cy.get('[data-cy=title]')
      .should('exist')
      .should('have.text', 'Vyber typ lekce')
  })
})
