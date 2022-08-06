const openFeedbackModal = () => {
  cy.findByRole('dialog').should('not.exist');
  cy.findByRole('button', { name: 'Feedback' }).click();
  cy.findByRole('dialog').should('have.length', 1);
};

describe('submits feedback', () => {
  it('displays feedback button on page', () => {
    cy.visit('/');
    cy.findByRole('button', { name: /Feedback/i }).should('have.length', 1);
  });

  it('can upvote', () => {
    cy.visit('/');
    openFeedbackModal();

    cy.findByRole('dialog').within(() => {
      cy.findByRole('radio', { name: '👍', checked: false }).click();
      cy.findByRole('radio', { name: '👍' }).should('have.attr', 'aria-checked', 'true');

      cy.findByRole('textbox').type('This is a test message');

      cy.findByRole('button', { name: /Submit/i }).click();
    });

    cy.get('[data-testid="toast"]').should('contain', 'We have received your feedback.');
  });

  it('can downvote', () => {
    cy.visit('/');
    openFeedbackModal();

    cy.findByRole('dialog').within(() => {
      cy.findByRole('radio', { name: '👎', checked: false }).click();
      cy.findByRole('radio', { name: '👎' }).should('have.attr', 'aria-checked', 'true');

      cy.findByRole('textbox').type('This is a test message');

      cy.findByRole('button', { name: /Submit/i }).click();
    });

    cy.get('[data-testid="toast"]').should('contain', 'We have received your feedback.');
  });
});

export {};
