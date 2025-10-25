import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/ordersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import {
  selectFeeds,
  selectOrdersLoading,
  selectIsAuthenticated,
  selectIngredients
} from '../../services/selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeeds);
  const loading = useSelector(selectOrdersLoading);
  const ingredients = useSelector(selectIngredients);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!orders.length && !loading) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, orders.length, loading]);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
