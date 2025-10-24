import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload && action.payload._id && action.payload.type) {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          if (!state.ingredients) {
            state.ingredients = [];
          }
          state.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        if (!state.ingredients) {
          state.ingredients = [];
        }
        state.ingredients = state.ingredients.filter(
          (item) => item.id !== action.payload
        );
      }
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      if (action.payload) {
        if (!state.ingredients) {
          state.ingredients = [];
        }
        const { fromIndex, toIndex } = action.payload;
        const item = state.ingredients[fromIndex];
        if (item) {
          state.ingredients.splice(fromIndex, 1);
          state.ingredients.splice(toIndex, 0, item);
        }
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
