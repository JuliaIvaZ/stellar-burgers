import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIsAuthenticated,
  selectOrderRequest,
  selectOrderModalData,
  selectConstructorItems,
  selectConstructorPrice
} from '../../services/selectors';
import {
  createOrder,
  clearOrderModal,
  fetchUserOrders
} from '../../services/slices/ordersSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const constructorItems = useSelector(selectConstructorItems);
  const price = useSelector(selectConstructorPrice);

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;

    // Проверяем авторизацию перед оформлением заказа
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Собираем массив ID ингредиентов для заказа
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    try {
      await dispatch(createOrder(ingredients));
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  // Очищаем конструктор после успешного оформления заказа
  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
      // Обновляем список заказов пользователя
      dispatch(fetchUserOrders());
    }
  }, [dispatch, orderModalData]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
