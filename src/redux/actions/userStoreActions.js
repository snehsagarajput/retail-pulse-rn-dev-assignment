import {USER_STORE} from '../actionType';
import {getStoresDetail, getUserData} from '../helper/firestoreHelper';
import {omit, orderBy, forOwn} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {startUploading, captureError} from '../../utils/utils';
import {FILTER_KEYS, ALL_KEY, ASYNC_STORAGE_KEYS} from '../../utils/constants';
import firestore from '@react-native-firebase/firestore';

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
      const storesData = await getStoresDetail(userData.stores);
      const stores = orderBy(storesData, (storeObj) =>
        storeObj?.data?.name?.toLowerCase?.(),
      );
      dispatch({
        type: USER_STORE.LOAD_USER_STORE_DATA,
        payload: {
          name: userData.name,
          stores,
        },
      });
      dispatch({
        type: USER_STORE.SET_FILTERED_STORE,
        payload: {
          filteredStore: stores.slice(),
        },
      });
      dispatch(setFilterOptions(stores));
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

const updatePendingImages =
  (
    imageObj = {storeId: '', imageLocalUri: '', timestamp: null},
    isDelete = false,
  ) =>
  async (dispatch, getState) => {
    try {
      const {
        userStore: {pendingImages},
        auth: {uid},
      } = getState();
      const updatedPendingImages = {};
      if (isDelete) {
        const exist = pendingImages[imageObj.storeId]?.[imageObj.imageLocalUri];
        if (exist) {
          if (Object.keys(pendingImages[imageObj.storeId]).length === 1) {
            Object.assign(
              updatedPendingImages,
              omit(
                pendingImages,
                imageObj.storeId,
                // : `${imageObj.storeId}.${imageObj.imageLocalUri}`,
              ),
            );
          } else {
            Object.assign(updatedPendingImages, {
              ...pendingImages,
              ...{
                [imageObj.storeId]: omit(
                  pendingImages[imageObj.storeId],
                  imageObj.imageLocalUri,
                ),
              },
            });
          }
        } else {
          return;
        }
      } else {
        Object.assign(updatedPendingImages, pendingImages, {
          [imageObj.storeId]: {
            [imageObj.imageLocalUri]: {
              timestamp: imageObj.timestamp,
            },
            ...(pendingImages[imageObj.storeId] || {}),
          },
        });
        startUploading(imageObj, uid, dispatch);
      }
      dispatch({
        type: USER_STORE.UPDATE_PENDING_IMAGES,
        payload: {
          pendingImages: updatedPendingImages,
        },
      });
      AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.PENDING_IMAGES,
        JSON.stringify(updatedPendingImages),
      );
    } catch (err) {
      captureError(err);
    }
  };

const setFilterOptions = (storesArray) => (dispatch) => {
  try {
    const options = {};
    FILTER_KEYS.forEach((key) => {
      options[key] = new Set();
    });
    storesArray.forEach((storeObj) => {
      const {data} = storeObj;
      FILTER_KEYS.forEach((key) => {
        if (data?.[key]) {
          options[key].add(data[key]);
        }
      });
    });
    const filterOptions = {};
    forOwn(options, (value, key) => {
      filterOptions[key] = orderBy(Array.from(value), (val) =>
        `${val}`?.toLowerCase?.(),
      );
    });
    dispatch({
      type: USER_STORE.SET_FILTER_OPTIONS,
      payload: {
        filterOptions,
      },
    });
  } catch (err) {
    captureError(err);
  }
};

const updateCurrentFilter = (filter) => (dispatch, getState) => {
  try {
    dispatch({
      type: USER_STORE.UPDATE_LOADING,
      payload: {
        isLoading: true,
      },
    });
    dispatch({
      type: USER_STORE.UPDATE_CURRENT_FILTER,
      payload: {
        currentFilter: filter,
      },
    });
    const {stores} = getState().userStore;
    const filteredStore = stores.filter(({data}) =>
      FILTER_KEYS.every((key) => {
        if (filter[key].length === 1 && filter[key][0] === ALL_KEY) {
          return true;
        }
        return filter[key].some((filteredVal) => data[key] === filteredVal);
      }),
    );
    dispatch({
      type: USER_STORE.SET_FILTERED_STORE,
      payload: {
        filteredStore: filteredStore,
      },
    });
  } catch (err) {
    captureError(err);
  }
  dispatch({
    type: USER_STORE.UPDATE_LOADING,
    payload: {
      isLoading: false,
    },
  });
};

const activateImagesListener = () => (dispatch) => {
  const onError = () => {};

  const onResult = (snapshot) => {
    try {
      const uploadedImages = {};
      snapshot.docs.forEach((doc) => {
        try {
          uploadedImages[doc.id] = doc.data();
        } catch (e) {
          captureError(e);
        }
      });
      dispatch({
        type: USER_STORE.UPDATE_UPLOADED_IMAGES,
        payload: {uploadedImages},
      });
    } catch (err) {
      captureError(err);
    }
  };

  const listerner = firestore()
    .collection('store-visit')
    .onSnapshot(onResult, onError);

  dispatch({
    type: USER_STORE.UPDATE_LISTENERS,
    payload: {
      listerners: [listerner],
    },
  });
};

export {
  loadUserData,
  updatePendingImages,
  updateCurrentFilter,
  activateImagesListener,
};
