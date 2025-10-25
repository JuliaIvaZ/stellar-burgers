import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/ordersSlice';
import {
  selectCurrentOrder,
  selectOrdersLoading
} from '../../services/selectors';
import { selectIngredients } from '../../services/selectors';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderData = useSelector(selectCurrentOrder);
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => {
    if (number && !orderData && !loading) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData, loading]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: (typeof ingredients)[0] & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
