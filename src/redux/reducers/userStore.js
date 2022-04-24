import {USER_STORE} from '../actionType';
import {getDefaultFilter} from '../../utils/utils';

const initialState = {
  isLoading: false,
  name: '',
  stores: [],
  isError: false,
  pendingImages: {},
  filterOptions: {},
  currentFilter: getDefaultFilter(),
  filteredStore: [],
};

export default userStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_STORE.UPDATE_LOADING: {
      return {
        ...state,
        isLoading: action.payload.isLoading ? true : false,
      };
    }
    case USER_STORE.LOAD_USER_STORE_DATA: {
      return {
        ...state,
        name: action.payload.name,
        stores: action.payload.stores,
      };
    }
    case USER_STORE.SET_ERROR: {
      return {
        ...state,
        isError: action.payload.isError ? true : false,
      };
    }
    case USER_STORE.UPDATE_CURRENT_FILTER: {
      return {
        ...state,
        currentFilter: action.payload.currentFilter,
      };
    }
    case USER_STORE.SET_FILTERED_STORE: {
      return {
        ...state,
        filteredStore: action.payload.filteredStore,
      };
    }
    case USER_STORE.SET_FILTER_OPTIONS: {
      return {
        ...state,
        filterOptions: action.payload.filterOptions,
      };
    }
    case USER_STORE.UPDATE_PENDING_IMAGES: {
      return {
        ...state,
        pendingImages: action.payload.pendingImages,
      };
    }
    case USER_STORE.RESET_STATE: {
      return {
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
};
