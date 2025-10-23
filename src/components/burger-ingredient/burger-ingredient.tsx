import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { v4 as uuidv4 } from 'uuid';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient } from '../../services/slices/constructorSlice';
import { selectIngredientCount } from '../../services/selectors';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const count = useSelector(selectIngredientCount(ingredient._id));

    const handleAdd = () => {
      const constructorIngredient = {
        ...ingredient,
        id: uuidv4()
      };
      dispatch(addIngredient(constructorIngredient));
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
