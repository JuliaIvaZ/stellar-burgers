import ingredientsReducer, {
  fetchIngredients,
  clearError
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: 'ingredient-1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: 'ingredient-2',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    }
  ];

  describe('fetchIngredients', () => {
    it('должен установить loading в true при pending', () => {
      const action = fetchIngredients.pending('', undefined);
      const state = ingredientsReducer(undefined, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен установить loading в false и сохранить данные при fulfilled', () => {
      const action = fetchIngredients.fulfilled(mockIngredients, '', undefined);
      const state = ingredientsReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('должен установить loading в false и сохранить ошибку при rejected', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = fetchIngredients.rejected(
        null,
        '',
        undefined,
        errorMessage
      );
      const state = ingredientsReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });

    it('должен очистить error при новом pending после ошибки', () => {
      // Сначала получаем ошибку
      let state = ingredientsReducer(
        undefined,
        fetchIngredients.rejected(null, '', undefined, 'Ошибка загрузки')
      );
      expect(state.error).toBeTruthy();

      // Затем начинаем новый запрос
      state = ingredientsReducer(
        state,
        fetchIngredients.pending('', undefined)
      );
      expect(state.error).toBeNull();
      expect(state.loading).toBe(true);
    });

    it('должен перезаписать данные при втором fulfilled', () => {
      const firstIngredients: TIngredient[] = [mockIngredients[0]];
      let state = ingredientsReducer(
        undefined,
        fetchIngredients.fulfilled(firstIngredients, '', undefined)
      );

      expect(state.items).toEqual(firstIngredients);

      // Загружаем новые данные
      state = ingredientsReducer(
        state,
        fetchIngredients.fulfilled(mockIngredients, '', undefined)
      );

      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(2);
    });
  });

  describe('clearError', () => {
    it('должен очистить ошибку', () => {
      let state = ingredientsReducer(
        undefined,
        fetchIngredients.rejected(null, '', undefined, 'Ошибка загрузки')
      );

      expect(state.error).toBeTruthy();

      state = ingredientsReducer(state, clearError());

      expect(state.error).toBeNull();
    });

    it('должен не изменить состояние если нет ошибки', () => {
      let state = ingredientsReducer(
        undefined,
        fetchIngredients.pending('', undefined)
      );
      const itemsCount = state.items.length;

      state = ingredientsReducer(state, clearError());

      expect(state.error).toBeNull();
      expect(state.items).toHaveLength(itemsCount);
    });
  });
});
