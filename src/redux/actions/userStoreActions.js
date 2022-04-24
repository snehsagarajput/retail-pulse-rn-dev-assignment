import {USER_STORE} from '../actionType';
import {getStoresDetail, getUserData} from '../helper/firestoreHelper';
import {omit, orderBy} from 'lodash';
import {ASYNC_STORAGE_KEYS} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {startUploading, captureError} from '../../utils/utils';

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
          stores: orderBy(storesData, (storeObj) =>
            storeObj?.data?.name?.toLowerCase?.(),
          ),
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

export {loadUserData, updatePendingImages};
