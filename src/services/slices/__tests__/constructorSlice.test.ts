import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../constructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const mockBun: TConstructorIngredient = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    id: 'bun-constructor-1'
  };

  const mockMain: TConstructorIngredient = {
    _id: 'main-1',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    id: 'main-constructor-1'
  };

  const mockSauce: TConstructorIngredient = {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    id: 'sauce-constructor-1'
  };

  const mockMain2: TConstructorIngredient = {
    _id: 'main-2',
    name: 'Био-марсианские котлеты',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 2244,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    id: 'main-constructor-2'
  };

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const state = constructorReducer(undefined, addIngredient(mockBun));

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('должен заменить булку при добавлении новой булки', () => {
      const initialState = constructorReducer(
        undefined,
        addIngredient(mockBun)
      );
      const newBun: TConstructorIngredient = {
        ...mockBun,
        _id: 'bun-2',
        id: 'bun-constructor-2'
      };

      const state = constructorReducer(initialState, addIngredient(newBun));

      expect(state.bun).toEqual(newBun);
      expect(state.bun?._id).toBe('bun-2');
    });

    it('должен добавить начинку в конструктор', () => {
      const state = constructorReducer(undefined, addIngredient(mockMain));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([mockMain]);
    });

    it('должен добавить соус в конструктор', () => {
      const state = constructorReducer(undefined, addIngredient(mockSauce));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toEqual([mockSauce]);
    });

    it('должен добавить несколько ингредиентов в конструктор', () => {
      let state = constructorReducer(undefined, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain2));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]).toEqual(mockMain);
      expect(state.ingredients[1]).toEqual(mockSauce);
      expect(state.ingredients[2]).toEqual(mockMain2);
    });

    it('должен добавить булку и начинку в конструктор', () => {
      let state = constructorReducer(undefined, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMain));

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([mockMain]);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент по id', () => {
      let state = constructorReducer(undefined, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain2));

      expect(state.ingredients).toHaveLength(3);

      state = constructorReducer(state, removeIngredient(mockSauce.id));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients).not.toContainEqual(mockSauce);
      expect(state.ingredients[0]).toEqual(mockMain);
      expect(state.ingredients[1]).toEqual(mockMain2);
    });

    it('должен удалить последний ингредиент', () => {
      let state = constructorReducer(undefined, addIngredient(mockMain));

      expect(state.ingredients).toHaveLength(1);

      state = constructorReducer(state, removeIngredient(mockMain.id));

      expect(state.ingredients).toHaveLength(0);
    });

    it('должен корректно обработать удаление несуществующего ингредиента', () => {
      let state = constructorReducer(undefined, addIngredient(mockMain));

      expect(state.ingredients).toHaveLength(1);

      state = constructorReducer(state, removeIngredient('non-existent-id'));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockMain);
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент с позиции 0 на позицию 2', () => {
      let state = constructorReducer(undefined, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain2));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]).toEqual(mockMain);
      expect(state.ingredients[1]).toEqual(mockSauce);
      expect(state.ingredients[2]).toEqual(mockMain2);

      state = constructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]).toEqual(mockSauce);
      expect(state.ingredients[1]).toEqual(mockMain2);
      expect(state.ingredients[2]).toEqual(mockMain);
    });

    it('должен переместить ингредиент с позиции 2 на позицию 0', () => {
      let state = constructorReducer(undefined, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain2));

      expect(state.ingredients[0]).toEqual(mockMain);

      state = constructorReducer(
        state,
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );

      expect(state.ingredients[0]).toEqual(mockMain2);
      expect(state.ingredients[1]).toEqual(mockMain);
      expect(state.ingredients[2]).toEqual(mockSauce);
    });

    it('должен переместить ингредиент с позиции 1 на позицию 1 (без изменений)', () => {
      let state = constructorReducer(undefined, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain2));

      const initialOrder = state.ingredients.map((ing) => ing.id);

      state = constructorReducer(
        state,
        moveIngredient({ fromIndex: 1, toIndex: 1 })
      );

      const finalOrder = state.ingredients.map((ing) => ing.id);
      expect(finalOrder).toEqual(initialOrder);
    });

    it('должен переместить ингредиент между соседними позициями', () => {
      let state = constructorReducer(undefined, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain2));

      // Меняем местами первый и второй ингредиент
      state = constructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 1 })
      );

      expect(state.ingredients[0]).toEqual(mockSauce);
      expect(state.ingredients[1]).toEqual(mockMain);
      expect(state.ingredients[2]).toEqual(mockMain2);
    });
  });
});
