describe('submits feedback', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays feedback button on page', () => {
    cy.get('[data-testid="feedback-button"]').should('have.length', 1);
  });

  it('can open feedback modal', () => {
    cy.get('[data-testid="feedback-button"]').click();
    cy.get('[aria-modal]').should('have.length', 1);
  });

  it('can upvote without message', () => {
    cy.get('[data-testid="feedback-button"]').click();

    const upvoteButton = cy.get('[aria-labelledby="Good"]');

    upvoteButton.click();
    upvoteButton.should('have.attr', 'aria-checked', 'true');

    cy.get('[aria-modal]').get('button[type="submit"]').click();

    cy.get('[role="alert"]').should('contain', 'We have received your feedback.');
  });

  it('can downvote without message', () => {
    cy.get('[data-testid="feedback-button"]').click();

    const upvoteButton = cy.get('[aria-labelledby="Bad"]');

    upvoteButton.click();
    upvoteButton.should('have.attr', 'aria-checked', 'true');

    cy.get('[aria-modal]').get('button[type="submit"]').click();

    cy.get('[role="alert"]').should('contain', 'We have received your feedback.');
  });

  it('can submit message inside modal', () => {
    cy.get('[data-testid="feedback-button"]').click();

    cy.get('[aria-labelledby="Good"]').click();
    cy.get('[aria-labelledby="Message"]').type('This is a test message');

    cy.get('[aria-modal]').get('button[type="submit"]').click();

    cy.get('[role="alert"]').should('contain', 'We have received your feedback.');
  });
});
