import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, Alert, Linking} from 'react-native';
import {COLORS} from '../styles/designValues';
import {useSelector, useDispatch} from 'react-redux';
import {updatePendingImages} from '../redux/actions/userStoreActions';
import {captureError, isIOS} from '../utils/utils';
import {Icon} from 'react-native-eva-icons';
import ModalComponent from './Modal';
import ImagePicker from 'react-native-image-crop-picker';
import * as RNFS from 'react-native-fs';

export default SelectedStore = ({onClose, selectedStore}) => {
  const dispatch = useDispatch();
  const [justUploaded, setJustUploaded] = useState(false);
  const pendingImagesCount = useSelector(
    (state) =>
      Object.keys(state.userStore?.pendingImages?.[selectedStore?.id] ?? {})
        .length,
  );

  const onUploadPress = async () => {
    try {
      const copyAssests = (uri) => {
        //copy image to data directory for background upload across sessions
        uri = isIOS ? decodeURIComponent(uri) : uri;
        const imagePath = `${
          RNFS.DocumentDirectoryPath
        }/${new Date().toISOString()}.jpg`.replace(/:/g, '-');
        RNFS.copyFile(uri, imagePath)
          .then(() => {
            setJustUploaded(true);
            dispatch(
              updatePendingImages({
                storeId: selectedStore.id,
                imageLocalUri: imagePath,
                timestamp: Date.now(),
              }),
            );
          })
          .catch(captureError);
      };
      ImagePicker.openCamera({
        cropping: true,
        multiple: true,
        compressImageQuality: 0.4,
      })
        .then((image) => {
          if (image?.path) {
            copyAssests(image.path);
          }
        })
        .catch((err) => {
          if (err.message.includes('User cancelled image selection')) {
            return;
          }
          let errMsg;
          if (err.code === 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR') {
            errMsg =
              'Camera is not available on this device. Please use some other device.';
          } else if (err.code === 'E_NO_CAMERA_PERMISSION') {
            Alert.alert(
              'Permission Required',
              'Camera permission is required to click pictures. Please grant permission in settings.',
              [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Open Settings', onPress: Linking.openSettings},
              ],
              {cancelable: false},
            );
          } else {
            errMsg = 'Something went wrong, please try again.';
            captureError(err);
          }
          if (errMsg) {
            Alert.alert('Error', errMsg);
          }
        });
    } catch (err) {
      captureError(err);
    }
  };

  return (
    <ModalComponent isVisible={true} onClose={onClose}>
      <Text numberOfLines={3} style={styles.storeName}>
        {selectedStore.data.name}
      </Text>
      <Text numberOfLines={4} style={styles.storeAddress}>
        {selectedStore.data.address}
      </Text>
      <Text
        style={[
          styles.imagePendingText,
          {marginVertical: pendingImagesCount || justUploaded ? 25 : 5},
        ]}>
        {pendingImagesCount
          ? `Uploading ${pendingImagesCount} Images.`
          : justUploaded
          ? 'All Images Uploaded Successfully. 🎉'
          : ''}
      </Text>
      <TouchableOpacity onPress={onUploadPress} style={styles.uploadBtn}>
        <Icon
          name={'camera'}
          width={26}
          height={26}
          fill={COLORS.WHITE}
          animation={'pulse'}
        />
        <Text style={styles.btnText}>{'Upload'}</Text>
      </TouchableOpacity>
    </ModalComponent>
  );
};

const styles = StyleSheet.create({
  storeName: {
    color: COLORS.BLACK,
    textTransform: 'capitalize',
    fontWeight: '600',
    fontSize: 22,
  },
  storeAddress: {
    color: COLORS.LIGHT_GREY,
    textTransform: 'capitalize',
    fontWeight: '400',
    fontSize: 16,
    marginTop: 2,
  },
  uploadBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.UPLOAD_BTN,
    minHeight: 50,
    borderRadius: 50,
    marginVertical: 10,
    width: '50%',
    flexDirection: 'row',
  },
  btnText: {
    fontSize: 18,
    color: COLORS.WHITE,
    marginLeft: 20,
    fontWeight: '700',
  },
  imagePendingText: {
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
  },
});
