import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersSlice';
import {
  selectUserOrders,
  selectOrdersLoading,
  selectIsAuthenticated
} from '../../services/selectors';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectOrdersLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasFetchedOrders = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasFetchedOrders.current && !loading) {
      dispatch(fetchUserOrders());
      hasFetchedOrders.current = true;
    }
  }, [dispatch, isAuthenticated, loading]);

  // Сбрасываем флаг при изменении авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      hasFetchedOrders.current = false;
    }
  }, [isAuthenticated]);

  if (loading && !orders.length) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return (
      <div className='text text_type_main-medium'>
        Для просмотра заказов необходимо авторизоваться
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
