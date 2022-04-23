import {BOARD_SIZE} from 'utils/constants';

const captureError = (error) => {
  console.error(error);
};

const getWishMsg = () => {
  let msg = 'Good ';
  try {
    const curHr = new Date().getHours();
    if (curHr < 4 || curr > 22) {
      msg += 'Night';
    } else if (curHr < 12) {
      msg += 'Morning';
    } else if (curHr < 18) {
      msg += 'Afternoon';
    } else {
      msg += 'Evening';
    }
  } catch (err) {
    msg += 'Day';
    captureError(err);
  }
  return msg;
};

export {captureError, getWishMsg};
