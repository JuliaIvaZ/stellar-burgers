import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersSlice';
import {
  selectUserOrders,
  selectOrdersLoading
} from '../../services/selectors';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => {
    if (!orders.length && !loading) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, orders.length, loading]);

  if (loading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
