describe('submits feedback', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays feedback button on page', () => {
    cy.get('[data-testid="feedback-button"]').should('have.length', 1);
  });

  it('can open feedback modal', () => {
    const newItem = 'Feed the cat';

    cy.get('[data-testid="feedback-button"]').click();
    cy.get('[aria-modal]').should('have.length', 1);
  });
});
