import authReducer, {
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
  updateUser,
  forgotPassword,
  resetPassword,
  clearError,
  setUser,
  clearUser
} from '../authSlice';
import { TUser } from '@utils-types';

describe('authSlice', () => {
  const mockUser: TUser = {
    email: 'test@test.test',
    name: 'Test User'
  };

  const mockUserResponse = {
    success: true,
    user: mockUser,
    accessToken: 'Bearer test-access-token',
    refreshToken: 'test-refresh-token'
  };

  describe('синхронные редьюсеры', () => {
    it('должен вернуть начальное состояние', () => {
      const state = authReducer(undefined, { type: 'unknown' });
      expect(state).toEqual({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    });

    it('должен очистить ошибку при clearError', () => {
      const state = authReducer(
        { user: null, isAuthenticated: false, loading: false, error: 'Ошибка' },
        clearError()
      );
      expect(state.error).toBeNull();
    });

    it('должен установить пользователя при setUser', () => {
      const state = authReducer(undefined, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('должен очистить пользователя при clearUser', () => {
      const state = authReducer(
        {
          user: mockUser,
          isAuthenticated: true,
          loading: false,
          error: null
        },
        clearUser()
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('registerUser', () => {
    it('должен установить loading в true при pending', () => {
      const action = registerUser.pending('', { email: '', name: '', password: '' });
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить данные пользователя при fulfilled', () => {
      const action = registerUser.fulfilled(mockUserResponse, '', {
        email: '',
        name: '',
        password: ''
      });
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = registerUser.rejected(null, '', { email: '', name: '', password: '' }, 'Ошибка');
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('loginUser', () => {
    it('должен установить loading в true при pending', () => {
      const action = loginUser.pending('', { email: '', password: '' });
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить данные пользователя при fulfilled', () => {
      const action = loginUser.fulfilled(mockUserResponse, '', {
        email: '',
        password: ''
      });
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = loginUser.rejected(null, '', { email: '', password: '' }, 'Ошибка');
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('logoutUser', () => {
    it('должен установить loading в true при pending', () => {
      const action = logoutUser.pending('');
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен очистить данные пользователя при fulfilled', () => {
      const state = authReducer(
        {
          user: mockUser,
          isAuthenticated: true,
          loading: false,
          error: null
        },
        logoutUser.fulfilled(undefined, '')
      );
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });

    it('должен очистить данные пользователя даже при rejected', () => {
      const action = logoutUser.rejected(null, '');
      const state = authReducer(
        {
          user: mockUser,
          isAuthenticated: true,
          loading: false,
          error: null
        },
        action
      );
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('fetchUser', () => {
    it('должен установить loading в true при pending', () => {
      const action = fetchUser.pending('');
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить данные пользователя при fulfilled', () => {
      const action = fetchUser.fulfilled(mockUser, '');
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = fetchUser.rejected(null, '', undefined, 'Ошибка');
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });

    it('должен очистить данные пользователя при jwt expired', () => {
      const action = fetchUser.rejected(null, '', undefined, 'jwt expired');
      const state = authReducer(
        {
          user: mockUser,
          isAuthenticated: true,
          loading: false,
          error: null
        },
        action
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('должен очистить данные пользователя при jwt malformed', () => {
      const action = fetchUser.rejected(null, '', undefined, 'jwt malformed');
      const state = authReducer(
        {
          user: mockUser,
          isAuthenticated: true,
          loading: false,
          error: null
        },
        action
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('должен установить loading в true при pending', () => {
      const action = updateUser.pending('', { email: '', name: '' });
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обновить данные пользователя при fulfilled', () => {
      const updatedUser: TUser = { email: 'updated@test.test', name: 'Updated User' };
      const action = updateUser.fulfilled(updatedUser, '', { email: '', name: '' });
      const state = authReducer(
        {
          user: mockUser,
          isAuthenticated: true,
          loading: false,
          error: null
        },
        action
      );
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(updatedUser);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = updateUser.rejected(null, '', { email: '', name: '' }, 'Ошибка');
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('forgotPassword', () => {
    it('должен установить loading в true при pending', () => {
      const action = forgotPassword.pending('', { email: '' });
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен установить loading в false при fulfilled', () => {
      const action = forgotPassword.fulfilled(undefined, '', { email: '' });
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = forgotPassword.rejected(null, '', { email: '' }, 'Ошибка');
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('resetPassword', () => {
    it('должен установить loading в true при pending', () => {
      const action = resetPassword.pending('', { password: '', token: '' });
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен установить loading в false при fulfilled', () => {
      const action = resetPassword.fulfilled(undefined, '', { password: '', token: '' });
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('должен сохранить ошибку при rejected', () => {
      const action = resetPassword.rejected(null, '', { password: '', token: '' }, 'Ошибка');
      const state = authReducer(undefined, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });
});

