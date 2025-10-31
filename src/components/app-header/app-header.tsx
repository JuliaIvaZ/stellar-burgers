import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser, selectIsAuthenticated } from '../../services/selectors';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleProfileClick = () => {
    // Проверяем авторизацию перед переходом в личный кабинет
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/profile');
  };

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
  };

  return (
    <AppHeaderUI
      userName={isAuthenticated ? user?.name || '' : ''}
      onProfileClick={handleProfileClick}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
    />
  );
};
