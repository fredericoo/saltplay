describe('Create match', () => {
  it('can perform dev sign in', () => {
    cy.visit('/');
    cy.findByRole('button', { name: /Dev Sign in/i }).click();
    cy.findByRole('menu').within(() => {
      cy.findAllByRole('menuitem').first().click();
    });
  });

  it('is signed in', () => {
    cy.get('[data-testid="logged-in-user-menu"]').should('exist');
    // .then($menuItem => {
    //     $menuItem.text();
    //   })
    //   .as('username');
  });

  it('can visit office page', () => {
    cy.get('[data-testid="hero-offices"]').within(() => {
      cy.findAllByRole('listitem', { force: true })
        .first()
        .click()
        .then($listItem => $listItem.attr('href'))
        .as('office-url');
    });
    cy.url().should('include', cy.get('@office-url'));
  });
});

export {};
