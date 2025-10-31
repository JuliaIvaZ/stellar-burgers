import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  it('должен правильно инициализироваться с начальным состоянием', () => {
    // Получаем начальное состояние из редюсера
    const state = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем, что все слайсы инициализированы
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('burgerConstructor');

    // Проверяем начальное состояние ingredients
    expect(state.ingredients).toEqual({
      items: [],
      loading: false,
      error: null
    });

    // Проверяем начальное состояние orders
    expect(state.orders).toEqual({
      feeds: [],
      userOrders: [],
      currentOrder: null,
      feedsData: null,
      loading: false,
      error: null,
      orderRequest: false,
      orderModalData: null
    });

    // Проверяем начальное состояние auth
    expect(state.auth).toEqual({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });

    // Проверяем начальное состояние burgerConstructor
    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен вернуть корректное начальное состояние при обработке неизвестного действия', () => {
    // Получаем состояние при обработке неизвестного действия
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что возвращается корректное начальное состояние
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('burgerConstructor');

    // Проверяем, что состояния не изменились
    expect(state.ingredients).toEqual({
      items: [],
      loading: false,
      error: null
    });

    expect(state.orders).toEqual({
      feeds: [],
      userOrders: [],
      currentOrder: null,
      feedsData: null,
      loading: false,
      error: null,
      orderRequest: false,
      orderModalData: null
    });

    expect(state.auth).toEqual({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
