import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { forgotPassword } from '../../services/slices/authSlice';
import {
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated
} from '../../services/selectors';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email) {
      dispatch(forgotPassword({ email }));
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
