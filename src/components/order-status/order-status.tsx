import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан',
  cancelled: 'Отменён'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  switch (status) {
    case 'done':
      textStyle = '#00CCCC';
      break;
    case 'pending':
      textStyle = '#E52B1A';
      break;
    case 'cancelled':
      textStyle = '#F2F2F3';
      break;
    default:
      textStyle = '#F2F2F3';
  }

  const text = statusText[status] || 'Неизвестен';

  return <OrderStatusUI textStyle={textStyle} text={text} />;
};
