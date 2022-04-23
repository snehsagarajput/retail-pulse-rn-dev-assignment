import {captureError} from '../../utils/utils';
import {USER_STORE} from '../actionType';
import {getStoresDetail, getUserData} from '../helper/firestoreHelper';

const loadUserData = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_STORE.UPDATE_LOADING,
      payload: {
        isLoading: true,
      },
    });
    dispatch({
      type: USER_STORE.SET_ERROR,
      payload: {
        isError: false,
      },
    });
    const {uid} = getState().auth;
    const userData = await getUserData(uid);
    dispatch({
      type: USER_STORE.LOAD_USER_STORE_DATA,
      payload: {
        name: userData.name,
        stores: [],
      },
    });
    if (userData.stores?.length) {
      const storesData = await getStoresDetail(userData.stores.slice(0, 20));
      dispatch({
        type: USER_STORE.LOAD_USER_STORE_DATA,
        payload: {
          name: userData.name,
          stores: storesData,
        },
      });
    }
  } catch (err) {
    captureError(err);
    dispatch({
      type: USER_STORE.SET_ERROR,
      payload: {isError: true},
    });
  }
  dispatch({
    type: USER_STORE.UPDATE_LOADING,
    payload: {
      isLoading: false,
    },
  });
};

export {loadUserData};
