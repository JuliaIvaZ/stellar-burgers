import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { v4 as uuidv4 } from 'uuid';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient } from '../../services/slices/constructorSlice';
import {
  selectIngredientCount,
  selectIsAuthenticated
} from '../../services/selectors';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const count = useSelector(selectIngredientCount(ingredient._id));
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const handleAdd = () => {
      if (!ingredient || !ingredient._id || !ingredient.type) return;

      const constructorIngredient = {
        ...ingredient,
        id: uuidv4()
      };
      // Очищаем данные от функций перед добавлением в состояние
      const cleanIngredient = {
        _id: constructorIngredient._id || '',
        name: constructorIngredient.name || '',
        type: constructorIngredient.type || '',
        proteins: constructorIngredient.proteins || 0,
        fat: constructorIngredient.fat || 0,
        carbohydrates: constructorIngredient.carbohydrates || 0,
        calories: constructorIngredient.calories || 0,
        price: constructorIngredient.price || 0,
        image: constructorIngredient.image || '',
        image_large: constructorIngredient.image_large || '',
        image_mobile: constructorIngredient.image_mobile || '',
        id: constructorIngredient.id
      };
      dispatch(addIngredient(cleanIngredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
