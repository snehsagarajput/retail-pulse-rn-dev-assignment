import {AUTH} from '../actionType';

const initialState = {
  authObj: null,
  uid: null,
};

export default authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH.LOAD_USER_AUTH: {
      return {
        ...state,
        authObj: action.payload.user,
        uid: action.payload.uid,
      };
    }
    case AUTH.REMOVE_USER_AUTH:
    case AUTH.RESET_STATE: {
      return {
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
};
