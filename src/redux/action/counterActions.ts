
import { INCREMENT, DECREMENT, TRANSFER_FEE } from './type';

export const increment = (): any => {
  return { type: INCREMENT };
};

export const decrement = (): any => {
  return { type: DECREMENT };
};

export const transfer = (): any => {
    return { type: TRANSFER_FEE };
  };
