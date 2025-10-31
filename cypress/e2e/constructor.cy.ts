// Константы селекторов
const SELECTORS = {
  modal: '[data-testid="modal"]',
  texts: {
    ingredientDetails: 'Детали ингредиента',
    orderButton: 'Оформить заказ',
    emptyBuns: 'Выберите булки',
    emptyFillings: 'Выберите начинку'
  },
  ingredientNames: {
    kratorBun: 'Краторная булка N-200i',
    bioBun: 'Био-марсианская булка N-200i',
    filling: 'Филе Люминесцентного тетраодонтимформа',
    spicySauce: 'Соус Spicy-X',
    spaceSauce: 'Соус фирменный Space Sauce'
  }
};

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запрос к API и возвращаем моковые данные
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Переходим на главную страницу
    cy.visit('/');
  });

  it('Должен загрузить ингредиенты с сервера', () => {
    cy.wait('@getIngredients');

    // Проверяем, что ингредиенты отображаются на странице
    cy.contains('Булки').should('be.visible');
    cy.contains('Начинки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
  });

  it('Должен добавить булку в конструктор', () => {
    cy.wait('@getIngredients');

    cy.addIngredient(SELECTORS.ingredientNames.kratorBun);

    // Проверяем, что булка появилась в конструкторе
    cy.contains(`${SELECTORS.ingredientNames.kratorBun} (верх)`).should('be.visible');
    cy.contains(`${SELECTORS.ingredientNames.kratorBun} (низ)`).should('be.visible');
  });

  it('Должен добавить начинку в конструктор', () => {
    cy.wait('@getIngredients');

    cy.switchToTab('Начинки');
    cy.addIngredient(SELECTORS.ingredientNames.filling, { force: true });

    // Проверяем, что кнопка "Оформить заказ" доступна
    cy.contains(SELECTORS.texts.orderButton).should('exist');
  });

  it('Должен добавить соус в конструктор', () => {
    cy.wait('@getIngredients');

    cy.switchToTab('Соусы');
    cy.addIngredient(SELECTORS.ingredientNames.spicySauce, { force: true });

    // Проверяем, что кнопка "Оформить заказ" доступна
    cy.contains(SELECTORS.texts.orderButton).should('exist');
  });

  it('Должен добавить булку и начинку в конструктор', () => {
    cy.wait('@getIngredients');

    cy.addIngredient(SELECTORS.ingredientNames.kratorBun);
    cy.switchToTab('Начинки');
    cy.addIngredient(SELECTORS.ingredientNames.filling, { force: true });

    // Проверяем, что оба ингредиента появились в конструкторе
    cy.contains(`${SELECTORS.ingredientNames.kratorBun} (верх)`).should('be.visible');
    cy.contains(`${SELECTORS.ingredientNames.kratorBun} (низ)`).should('be.visible');
    cy.contains(SELECTORS.ingredientNames.filling).should('exist');
  });

  it('Должен добавить несколько ингредиентов разных типов', () => {
    cy.wait('@getIngredients');

    cy.addIngredient(SELECTORS.ingredientNames.bioBun);
    cy.switchToTab('Начинки');
    cy.addIngredient(SELECTORS.ingredientNames.filling, { force: true });
    cy.switchToTab('Соусы');
    cy.addIngredient(SELECTORS.ingredientNames.spaceSauce, { force: true });

    // Проверяем, что все ингредиенты появились в конструкторе
    cy.contains(`${SELECTORS.ingredientNames.bioBun} (верх)`).should('be.visible');
    cy.contains(`${SELECTORS.ingredientNames.bioBun} (низ)`).should('be.visible');
    cy.contains(SELECTORS.ingredientNames.filling).should('exist');
    cy.contains(SELECTORS.ingredientNames.spaceSauce).should('exist');
  });
});

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
  });

  it('Должен открыть модальное окно при клике на ингредиент', () => {
    cy.wait('@getIngredients');

    cy.openIngredientModal(SELECTORS.ingredientNames.kratorBun);

    // Проверяем открытие
    cy.get(SELECTORS.modal).should('be.visible');
    cy.contains(SELECTORS.texts.ingredientDetails).should('be.visible');
  });

  it('Должен закрыть модальное окно при клике на крестик', () => {
    cy.wait('@getIngredients');

    cy.openIngredientModal(SELECTORS.ingredientNames.kratorBun);

    // Проверяем открытие
    cy.get(SELECTORS.modal).should('be.visible');
    cy.contains(SELECTORS.texts.ingredientDetails).should('be.visible');

    cy.closeModal();

    // Проверяем закрытие
    cy.get(SELECTORS.modal).should('not.exist');
    cy.contains(SELECTORS.texts.ingredientDetails).should('not.exist');
  });

  it('Должен закрыть модальное окно при клике на оверлей', () => {
    cy.wait('@getIngredients');

    cy.openIngredientModal(SELECTORS.ingredientNames.kratorBun);

    // Проверяем открытие
    cy.get(SELECTORS.modal).should('be.visible');
    cy.contains(SELECTORS.texts.ingredientDetails).should('be.visible');

    cy.closeModalByOverlay();

    // Проверяем закрытие
    cy.get(SELECTORS.modal).should('not.exist');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    // Подставляем моковые токены авторизации
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'test-refresh-token-12345');
    });
    cy.setCookie('accessToken', 'Bearer test-access-token-12345');

    // Перехватываем запросы к API
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

    cy.visit('/');
  });

  afterEach(() => {
    // Очищаем фейковые токены после каждого теста
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
    cy.clearCookies();
  });

  it('Должен создать заказ и открыть модальное окно с номером заказа', () => {
    cy.wait(['@getIngredients', '@getUser']);

    cy.addIngredient(SELECTORS.ingredientNames.kratorBun);
    cy.switchToTab('Начинки');
    cy.addIngredient(SELECTORS.ingredientNames.filling, { force: true });

    // Оформляем заказ
    cy.contains(SELECTORS.texts.orderButton).click({ force: true });

    // Проверяем модальное окно заказа
    cy.wait('@createOrder').then((interception) => {
      expect(interception.response).to.not.be.undefined;
      const orderNumber = interception.response!.body.order.number;

      // Проверяем модальное окно с номером заказа
      cy.get(SELECTORS.modal).should('be.visible');
      cy.contains(`#${String(orderNumber).padStart(6, '0')}`).should('be.visible');

      cy.closeModal();

      // Проверяем закрытие
      cy.get(SELECTORS.modal).should('not.exist');
    });

    // Проверяем сброс конструктора
    cy.contains(SELECTORS.texts.emptyBuns).should('be.visible');
  });
});
