import {Platform} from 'react-native';
import storage from '@react-native-firebase/storage';
import {backOff} from 'exponential-backoff';
import {addToStoreVisitNode} from '../redux/helper/firestoreHelper';
import {updatePendingImages} from '../redux/actions/userStoreActions';
import {isEmpty, forOwn} from 'lodash';

const isIOS = Platform.OS === 'ios';

const captureError = (error) => {
  console.error(error);
};

const getWishMsg = () => {
  let msg = 'Good ';
  try {
    const curHr = new Date().getHours();
    if (curHr < 4 || curHr > 22) {
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

const imageUploadPromise = (imageLocalPath, imagePathFirebaseStorage) => {
  const tryUploading = () =>
    new Promise((resolve) => {
      try {
        const onFail = (err) => {
          captureError(err);
          return resolve(null);
        };
        const reference = storage().ref(imagePathFirebaseStorage);
        const task = reference.putFile(imageLocalPath);
        task
          .then(() => {
            reference.getDownloadURL().then(resolve).catch(onFail);
          })
          .catch(onFail);
      } catch (err) {
        return onFail(err);
      }
    });
  return backOff(() => tryUploading(), {
    delayFirstAttempt: false,
    maxDelay: 600000, //10min
    numOfAttempts: 10,
  });
};

const startUploading = (imageObj, uid, dispatch) =>
  imageUploadPromise(
    imageObj.imageLocalUri,
    `images/${imageObj.storeId}/${uid}_${imageObj.timestamp}_0`,
  ).then((imageUrl) => {
    if (imageUrl?.length) {
      addToStoreVisitNode(imageObj.storeId, uid, {
        imageUrl,
        timestamp: imageObj.timestamp,
      });
      dispatch(updatePendingImages(imageObj, true));
    }
  });

const uploadPendingImages = (pendingImages, uid, dispatch) => {
  if (!isEmpty(pendingImages)) {
    forOwn(pendingImages, (storeImages, storeId) => {
      forOwn(storeImages, (imageObj, imageLocalUri) => {
        startUploading(
          {
            ...imageObj,
            storeId,
            imageLocalUri,
          },
          uid,
          dispatch,
        );
      });
    });
  }
};

export {isIOS, captureError, getWishMsg, startUploading, uploadPendingImages};
