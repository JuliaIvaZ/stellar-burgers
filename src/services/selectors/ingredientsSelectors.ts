import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.items.find((ingredient) => ingredient._id === id);

export const selectIngredientsByType = (type: string) =>
  createSelector([selectIngredients], (ingredients) =>
    ingredients.filter((ingredient) => ingredient.type === type)
  );
