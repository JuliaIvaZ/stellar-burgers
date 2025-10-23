import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser, selectIsAuthenticated } from '../../services/selectors';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return <AppHeaderUI userName={isAuthenticated ? user?.name || '' : ''} />;
};
