import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

export const selectFeeds = (state: RootState) => state.orders.feeds;
export const selectUserOrders = (state: RootState) => state.orders.userOrders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectFeedsData = (state: RootState) => state.orders.feedsData;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.orders.orderModalData;

export const selectOrderByNumber = (number: number) =>
  createSelector([selectFeeds, selectUserOrders], (feeds, userOrders) =>
    [...feeds, ...userOrders].find((order) => order.number === number)
  );

export const selectOrdersByStatus = (status: string) =>
  createSelector([selectUserOrders], (userOrders) =>
    userOrders.filter((order) => order.status === status)
  );
