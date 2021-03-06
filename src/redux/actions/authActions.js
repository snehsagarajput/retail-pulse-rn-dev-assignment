import {AUTH, USER_STORE} from '../actionType';

const loadUserAuth = (userObj) => async (dispatch) => {
  dispatch({
    type: AUTH.LOAD_USER_AUTH,
    payload: {
      user: userObj,
      uid: userObj.uid,
    },
  });
};

const removeUserAuth = () => async (dispatch) => {
  dispatch({
    type: USER_STORE.DEACTIVATE_LISTENERS,
  });
  dispatch({
    type: AUTH.RESET_STATE,
  });
};

export {loadUserAuth, removeUserAuth};
