import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

export const selectConstructorItems = (state: RootState) => state.constructor;

export const selectConstructorBun = (state: RootState) => state.constructor.bun;

export const selectIngredientCount = (ingredientId: string) =>
  createSelector([selectConstructorItems], (constructorItems) => {
    let count = 0;
    if (constructorItems.bun?._id === ingredientId) {
      count += 2;
    }
    if (constructorItems.ingredients) {
      constructorItems.ingredients.forEach((ingredient) => {
        if (ingredient._id === ingredientId) {
          count++;
        }
      });
    }
    return count;
  });

export const selectConstructorPrice = createSelector(
  [selectConstructorItems],
  (constructorItems) => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients
      ? constructorItems.ingredients.reduce(
          (sum, ingredient) => sum + ingredient.price,
          0
        )
      : 0;
    return bunPrice + ingredientsPrice;
  }
);
