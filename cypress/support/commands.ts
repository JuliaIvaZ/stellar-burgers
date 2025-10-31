/// <reference types="cypress" />

// Кастомные команды для тестов
Cypress.Commands.add('switchToTab', (tabName: string) => {
  cy.contains(tabName).click();
  cy.wait(300); // Ожидаем прокрутку к секции
});

Cypress.Commands.add('addIngredient', (ingredientName: string, options?: { force?: boolean }) => {
  const clickOptions = options?.force ? { force: true } : {};
  cy.contains('li', ingredientName).find('button').contains('Добавить').click(clickOptions);
});

Cypress.Commands.add('openIngredientModal', (ingredientName: string) => {
  cy.get('[data-testid="ingredient-item"]')
    .contains(ingredientName)
    .click({ force: true });
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[data-testid="modal-close"]').click();
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-testid="modal-overlay"]').click({ force: true });
});

export {};
