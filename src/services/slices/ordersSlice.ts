import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi,
  orderBurgerApi
} from '@api';

export interface OrdersState {
  feeds: TOrder[];
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  feedsData: TOrdersData | null;
  loading: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: { number: number } | null;
}

const initialState: OrdersState = {
  feeds: [],
  userOrders: [],
  currentOrder: null,
  feedsData: null,
  loading: false,
  error: null,
  orderRequest: false,
  orderModalData: null
};

// Асинхронная thunk-функция для получения ленты заказов
export const fetchFeeds = createAsyncThunk(
  'orders/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки ленты заказов'
      );
    }
  }
);

// Асинхронная thunk-функция для получения заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки заказов пользователя'
      );
    }
  }
);

// Асинхронная thunk-функция для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      return data.orders[0]; // API возвращает массив, берем первый элемент
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки заказа'
      );
    }
  }
);

// Асинхронная thunk-функция для создания заказа
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredients);
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка создания заказа'
      );
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    },
    setCurrentOrder: (state, action: PayloadAction<TOrder | null>) => {
      state.currentOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch feeds
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.loading = false;
          // Очищаем данные от несериализуемых свойств
          const orders = action.payload.orders.map((order) => {
            // Создаем новый объект без несериализуемых свойств
            const cleanOrder: TOrder = {
              _id: order._id,
              status: order.status,
              name: order.name,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              number: order.number,
              ingredients: order.ingredients
            };
            return cleanOrder;
          });
          state.feeds = orders;
          state.feedsData = {
            ...action.payload,
            orders
          };
          state.error = null;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.userOrders = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Если получили ошибку 401, очищаем заказы пользователя
        if (
          action.payload === 'jwt expired' ||
          action.payload === 'jwt malformed'
        ) {
          state.userOrders = [];
        }
      })
      // Fetch order by number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.currentOrder = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;

        if (
          action.payload &&
          action.payload.order &&
          action.payload.order.number
        ) {
          // Проверяем, есть ли полные данные заказа
          if (
            action.payload.order._id &&
            action.payload.order.status &&
            action.payload.order.name
          ) {
            const cleanOrder: TOrder = {
              _id: action.payload.order._id,
              status: action.payload.order.status,
              name: action.payload.order.name,
              createdAt:
                action.payload.order.createdAt || new Date().toISOString(),
              updatedAt:
                action.payload.order.updatedAt || new Date().toISOString(),
              number: action.payload.order.number,
              ingredients: action.payload.order.ingredients || []
            };

            // Добавляем новый заказ в начало массивов
            state.feeds.unshift(cleanOrder);
            state.userOrders.unshift(cleanOrder);

            // Обновляем feedsData
            if (state.feedsData) {
              state.feedsData.total += 1;
              state.feedsData.totalToday += 1;
              state.feedsData.orders = state.feeds;
            }
          }

          state.orderModalData = { number: action.payload.order.number };
        }
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearOrderModal, setCurrentOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
