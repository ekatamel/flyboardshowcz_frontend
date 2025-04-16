describe('Lesson Carousel', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/lessons/lessonsConfiguration', {
      fixture: 'lessons.json',
    }).as('getLessons')

    cy.setLargeViewport() // testing only large screens
    cy.visit('/nakup-voucheru')
    cy.wait('@getLessons')
  })

  it('renders 3 lesson cards with title, minutes and price information', () => {
    // 1st lesson card
    cy.get('[data-cy="lesson-title-6"]').should('have.text', 'Doporučená lekce')
    cy.get('[data-cy="lesson-min-6"]').should('have.text', '35 min')
    cy.get('[data-cy="lesson-price-6"]').should('have.text', '1799,-')

    // 2nd lesson card
    cy.get('[data-cy="lesson-title-12"]').should(
      'have.text',
      'VIP lekce s Petrem Civínem',
    )
    cy.get('[data-cy="lesson-min-12"]').should('have.text', '120 min')
    cy.get('[data-cy="lesson-price-12"]').should('have.text', '900,-')

    // 3d lesson card
    cy.get('[data-cy="lesson-title-10"]').should(
      'have.text',
      'Flyboardový dárkový set',
    )
    cy.get('[data-cy="lesson-min-10"]').should('have.text', '40 min')
    cy.get('[data-cy="lesson-price-10"]').should('have.text', '4949,-')
  })

  it('should show recommended lesson with id 1006 in the middle of carousel as highlighted', () => {
    cy.get('[data-cy="lesson-6"]').should('have.class', 'swiper-slide-active')
    cy.get('[data-cy="lesson-6"]').should(
      'have.attr',
      'data-swiper-slide-index',
      '1',
    ) // starting from 0 - lesson in the middle has index of 1
  })

  it('should move carousel slides to the left and right and change highlighted lesson when clicking arrows', () => {
    cy.get('.swiper-button-next').should('exist').click()
    cy.get('[data-cy="lesson-10"]').should('have.class', 'swiper-slide-active')

    cy.get('.swiper-button-prev').should('exist').click()
    cy.get('[data-cy="lesson-6"]').should('have.class', 'swiper-slide-active')
  })

  it('should highlight clicked lesson', () => {
    cy.get('[data-cy="lesson-10"]').click()
    cy.get('[data-cy="lesson-10"]').should('have.class', 'swiper-slide-active')
  })
})
