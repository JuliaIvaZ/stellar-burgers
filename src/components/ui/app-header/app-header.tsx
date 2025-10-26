import React, { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onProfileClick,
  onConstructorClick,
  onFeedClick
}) => {
  const location = useLocation();

  // Проверяем, активна ли страница профиля или страницы авторизации
  const isProfileActive =
    location.pathname.startsWith('/profile') ||
    ['/login', '/register', '/forgot-password', '/reset-password'].includes(
      location.pathname
    );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.link_active}` : styles.link;

  const profileLinkClass = () =>
    isProfileActive ? `${styles.link} ${styles.link_active}` : styles.link;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to='/' onClick={onConstructorClick} className={linkClass}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2 mr-10'>
                  Конструктор
                </p>
              </>
            )}
          </NavLink>
          <NavLink to='/feed' onClick={onFeedClick} className={linkClass}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2'>
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <NavLink
          to='/profile'
          onClick={onProfileClick}
          className={profileLinkClass}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexBasis: '35%'
          }}
        >
          <>
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </>
        </NavLink>
      </nav>
    </header>
  );
};
