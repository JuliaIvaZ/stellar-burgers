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
    // Проверяем, что запрос был выполнен
    cy.wait('@getIngredients');

    // Проверяем, что ингредиенты отображаются на странице
    cy.contains('Булки').should('be.visible');
    cy.contains('Начинки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
  });

  it('Должен добавить булку в конструктор', () => {
    cy.wait('@getIngredients');

    // Ищем и кликаем по кнопке "Добавить" у первой булки
    cy.contains('li', 'Краторная булка N-200i').find('button').contains('Добавить').click();

    // Проверяем, что булка появилась в конструкторе
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
  });

  it('Должен добавить начинку в конструктор', () => {
    cy.wait('@getIngredients');

    // Переключаемся на вкладку "Начинки"
    cy.contains('Начинки').click();
    
    // Ожидаем прокрутку к секции начинок
    cy.wait(300);

    // Ищем и кликаем по кнопке "Добавить" у начинки
    cy.contains('li', 'Филе Люминесцентного тетраодонтимформа')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    // Проверяем, что кнопка "Оформить заказ" доступна
    cy.contains('Оформить заказ').should('exist');
  });

  it('Должен добавить соус в конструктор', () => {
    cy.wait('@getIngredients');

    // Переключаемся на вкладку "Соусы"
    cy.contains('Соусы').click();
    
    // Ожидаем прокрутку к секции соусов
    cy.wait(300);

    // Ищем и кликаем по кнопке "Добавить" у соуса
    cy.contains('li', 'Соус Spicy-X').find('button').contains('Добавить').click({ force: true });

    // Проверяем, что кнопка "Оформить заказ" доступна
    cy.contains('Оформить заказ').should('exist');
  });

  it('Должен добавить булку и начинку в конструктор', () => {
    cy.wait('@getIngredients');

    // Добавляем булку
    cy.contains('li', 'Краторная булка N-200i').find('button').contains('Добавить').click();

    // Переключаемся на вкладку "Начинки"
    cy.contains('Начинки').click();
    
    // Ожидаем прокрутку к секции начинок
    cy.wait(300);

    // Добавляем начинку
    cy.contains('li', 'Филе Люминесцентного тетраодонтимформа')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    // Проверяем, что оба ингредиента появились в конструкторе
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
  });

  it('Должен добавить несколько ингредиентов разных типов', () => {
    cy.wait('@getIngredients');

    // Добавляем булку
    cy.contains('li', 'Био-марсианская булка N-200i')
      .find('button')
      .contains('Добавить')
      .click();

    // Переключаемся на вкладку "Начинки"
    cy.contains('Начинки').click();
    
    // Ожидаем прокрутку к секции начинок
    cy.wait(300);

    // Добавляем начинку
    cy.contains('li', 'Филе Люминесцентного тетраодонтимформа')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    // Переключаемся на вкладку "Соусы"
    cy.contains('Соусы').click();
    
    // Ожидаем прокрутку к секции соусов
    cy.wait(300);

    // Добавляем соус
    cy.contains('li', 'Соус фирменный Space Sauce')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    // Проверяем, что все ингредиенты появились в конструкторе
    cy.contains('Био-марсианская булка N-200i (верх)').should('be.visible');
    cy.contains('Био-марсианская булка N-200i (низ)').should('be.visible');
    cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
    cy.contains('Соус фирменный Space Sauce').should('exist');
  });
});

// Тесты для модальных окон
describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
  });

  it('Должен открыть модальное окно при клике на ингредиент', () => {
    cy.wait('@getIngredients');

    // Открываем модальное окно
    cy.get('[data-testid="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .click({ force: true });

    // Проверяем открытие
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');
  });

  it('Должен закрыть модальное окно при клике на крестик', () => {
    cy.wait('@getIngredients');

    // Открываем модальное окно
    cy.get('[data-testid="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .click({ force: true });

    // Проверяем открытие
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');

    // Закрываем крестиком
    cy.get('[data-testid="modal-close"]').click();

    // Проверяем закрытие
    cy.get('[data-testid="modal"]').should('not.exist');
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('Должен закрыть модальное окно при клике на оверлей', () => {
    cy.wait('@getIngredients');

    // Открываем модальное окно
    cy.get('[data-testid="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .click({ force: true });

    // Проверяем открытие
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');

    // Кликаем на оверлей
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    // Проверяем закрытие
    cy.get('[data-testid="modal"]').should('not.exist');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

});

// Тесты для создания заказа
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
    // Ждем, пока ингредиенты загрузятся и авторизация пройдет
    cy.wait(['@getIngredients', '@getUser']);

    // Добавляем ингредиенты
    cy.contains('li', 'Краторная булка N-200i').find('button').contains('Добавить').click();
    
    cy.contains('Начинки').click();
    cy.wait(300);
    
    cy.contains('li', 'Филе Люминесцентного тетраодонтимформа')
      .find('button')
      .contains('Добавить')
      .click({ force: true });

    // Оформляем заказ
    cy.contains('Оформить заказ').click({ force: true });

    // Проверяем модальное окно заказа
    cy.wait('@createOrder').then((interception) => {
      expect(interception.response).to.not.be.undefined;
      const orderNumber = interception.response!.body.order.number;
      
      // Проверяем модальное окно с номером заказа
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.contains(`#${String(orderNumber).padStart(6, '0')}`).should('be.visible');

      // Закрываем модальное окно
      cy.get('[data-testid="modal-close"]').click();

      // Проверяем закрытие
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    // Проверяем сброс конструктора
    cy.contains('Выберите булки').should('be.visible');
  });
});
