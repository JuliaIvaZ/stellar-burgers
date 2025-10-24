import { FC, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIsAuthenticated,
  selectAuthLoading
} from '../../services/selectors';
import { fetchUser } from '../../services/slices/authSlice';
import { Preloader } from '../ui/preloader';
import { getCookie } from '../../utils/cookie';

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
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Проверяем авторизацию только один раз при загрузке приложения
    if (!hasCheckedAuth.current) {
      const accessToken = getCookie('accessToken');
      if (!isAuthenticated && !loading && accessToken) {
        dispatch(fetchUser());
      }
      hasCheckedAuth.current = true;
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
