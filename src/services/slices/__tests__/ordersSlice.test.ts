import ordersReducer, {
  fetchFeeds,
  fetchUserOrders,
  fetchOrderByNumber,
  createOrder,
  clearError,
  clearOrderModal,
  setCurrentOrder
} from '../ordersSlice';
import { TOrder, TOrdersData } from '@utils-types';

describe('ordersSlice', () => {
  const mockOrder: TOrder = {
    _id: 'test-order-id',
    status: 'done',
    name: 'Test Order',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093e']
  };

  const mockOrdersData: TOrdersData = {
    orders: [mockOrder],
    total: 1,
    totalToday: 1
  };

  describe('синхронные редьюсеры', () => {
    it('должен вернуть начальное состояние', () => {
      const state = ordersReducer(undefined, { type: 'unknown' });
      expect(state).toEqual({
        feeds: [],
        userOrders: [],
        currentOrder: null,
        feedsData: null,
        loading: false,
        error: null,
        orderRequest: false,
        orderModalData: null
      });
    });

    it('должен очистить ошибку при clearError', () => {
      const state = ordersReducer(
        {
          feeds: [],
          userOrders: [],
          currentOrder: null,
          feedsData: null,
          loading: false,
          error: 'Ошибка',
          orderRequest: false,
          orderModalData: null
        },
        clearError()
      );
      expect(state.error).toBeNull();
    });

    it('должен очистить модальное окно заказа при clearOrderModal', () => {
      const state = ordersReducer(
        {
          feeds: [],
          userOrders: [],
          currentOrder: null,
          feedsData: null,
          loading: false,
          error: null,
          orderRequest: true,
          orderModalData: { number: 12345 }
        },
        clearOrderModal()
      );
      expect(state.orderModalData).toBeNull();
      expect(state.orderRequest).toBe(false);
    });

    it('должен установить текущий заказ при setCurrentOrder', () => {
      const state = ordersReducer(undefined, setCurrentOrder(mockOrder));
      expect(state.currentOrder).toEqual(mockOrder);
    });

    it('должен очистить текущий заказ при setCurrentOrder(null)', () => {
      const state = ordersReducer(
        {
          feeds: [],
          userOrders: [],
          currentOrder: mockOrder,
          feedsData: null,
          loading: false,
          error: null,
          orderRequest: false,
          orderModalData: null
        },
        setCurrentOrder(null)
      );
      expect(state.currentOrder).toBeNull();
    });
  });

  describe('fetchFeeds', () => {
    it('должен установить loading в true при pending', () => {
      const action = fetchFeeds.pending('');
      const state = ordersReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить данные ленты заказов при fulfilled', () => {
      const action = fetchFeeds.fulfilled(mockOrdersData as any, '');
      const state = ordersReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.feeds).toEqual([mockOrder]);
      expect(state.feedsData).toEqual(mockOrdersData);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = fetchFeeds.rejected(null, '', undefined, 'Ошибка');
      const state = ordersReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('fetchUserOrders', () => {
    it('должен установить loading в true при pending', () => {
      const action = fetchUserOrders.pending('');
      const state = ordersReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить заказы пользователя при fulfilled', () => {
      const action = fetchUserOrders.fulfilled([mockOrder], '');
      const state = ordersReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual([mockOrder]);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = fetchUserOrders.rejected(null, '', undefined, 'Ошибка');
      const state = ordersReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });

    it('должен очистить заказы пользователя при jwt expired', () => {
      const action = fetchUserOrders.rejected(null, '', undefined, 'jwt expired');
      const state = ordersReducer(
        {
          feeds: [],
          userOrders: [mockOrder],
          currentOrder: null,
          feedsData: null,
          loading: false,
          error: null,
          orderRequest: false,
          orderModalData: null
        },
        action
      );
      expect(state.userOrders).toEqual([]);
    });

    it('должен очистить заказы пользователя при jwt malformed', () => {
      const action = fetchUserOrders.rejected(null, '', undefined, 'jwt malformed');
      const state = ordersReducer(
        {
          feeds: [],
          userOrders: [mockOrder],
          currentOrder: null,
          feedsData: null,
          loading: false,
          error: null,
          orderRequest: false,
          orderModalData: null
        },
        action
      );
      expect(state.userOrders).toEqual([]);
    });
  });

  describe('fetchOrderByNumber', () => {
    it('должен установить loading в true при pending', () => {
      const action = fetchOrderByNumber.pending('', 12345);
      const state = ordersReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить заказ по номеру при fulfilled', () => {
      const action = fetchOrderByNumber.fulfilled(mockOrder, '', 12345);
      const state = ordersReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = fetchOrderByNumber.rejected(null, '', 12345, 'Ошибка');
      const state = ordersReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('createOrder', () => {
    it('должен установить orderRequest в true при pending', () => {
      const action = createOrder.pending('', ['ingredient1', 'ingredient2']);
      const state = ordersReducer(undefined, action);
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить номер заказа при fulfilled', () => {
      const action = createOrder.fulfilled(
        { success: true, name: 'Test Order', order: mockOrder },
        '',
        ['ingredient1', 'ingredient2']
      );
      const state = ordersReducer(undefined, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual({ number: 12345 });
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = createOrder.rejected(null, '', ['ingredient1'], 'Ошибка');
      const state = ordersReducer(undefined, action);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });
});

