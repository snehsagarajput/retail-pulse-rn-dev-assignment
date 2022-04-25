import {USER_STORE} from '../actionType';
import {getDefaultFilter} from '../../utils/utils';

const initialState = {
  isLoading: true,
  name: '',
  stores: [],
  isError: false,
  pendingImages: {},
  filterOptions: {},
  currentFilter: getDefaultFilter(),
  filteredStore: [],
  uploadedImages: {},
  listeners: [],
};

export default userStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_STORE.UPDATE_LOADING: {
      return {
        ...state,
        isLoading: action.payload.isLoading ? true : false,
      };
    }
    case USER_STORE.UPDATE_LISTENERS: {
      return {
        ...state,
        listeners: [...state.listeners, action.payload.listeners],
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
    case USER_STORE.UPDATE_UPLOADED_IMAGES: {
      return {
        ...state,
        uploadedImages: action.payload.uploadedImages,
      };
    }
    case USER_STORE.DEACTIVATE_LISTENERS: {
      state.listeners.forEach((listener) => listener?.());
      return {
        ...state,
        listeners: [],
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
