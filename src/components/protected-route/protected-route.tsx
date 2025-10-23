import { FC, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIsAuthenticated,
  selectAuthLoading
} from '../../services/selectors';
import { fetchUser } from '../../services/slices/authSlice';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    // Проверяем авторизацию при загрузке компонента
    if (!isAuthenticated && !loading) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  // Показываем лоадер во время проверки авторизации
  if (loading) {
    return <Preloader />;
  }

  // Если требуется авторизация, но пользователь не авторизован
  if (requireAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Если пользователь авторизован, но пытается зайти на страницы авторизации
  if (!requireAuth && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};
