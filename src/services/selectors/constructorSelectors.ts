import { RootState } from '../store';
import { TConstructorIngredient } from '@utils-types';

export const selectConstructorItems = (state: RootState) => ({
  bun: state.constructor.bun,
  ingredients: state.constructor.ingredients
});

export const selectConstructorBun = (state: RootState) => state.constructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.constructor.ingredients;

export const selectIngredientCount =
  (ingredientId: string) => (state: RootState) => {
    const { bun, ingredients } = state.constructor;

    // Для булки возвращаем 2 (верх и низ)
    if (bun && bun._id === ingredientId) {
      return 2;
    }

    // Для начинок и соусов считаем количество
    return ingredients.filter((ingredient) => ingredient._id === ingredientId)
      .length;
  };

export const selectConstructorPrice = (state: RootState) => {
  const { bun, ingredients } = state.constructor;

  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (sum, ingredient) => sum + ingredient.price,
    0
  );

  return bunPrice + ingredientsPrice;
};
