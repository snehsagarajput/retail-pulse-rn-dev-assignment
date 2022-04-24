import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../styles/designValues';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';

export default ModalComponent = ({isVisible, onClose, style, children}) => {
  const width = Dimensions.get('screen').width;
  return (
    <Modal
      hasBackdrop
      avoidKeyboard
      propagateSwipes
      isVisible={isVisible}
      deviceWidth={width}
      animationIn={'slideInUp'}
      style={[styles.modal]}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <SafeAreaView style={[styles.modalView, style]}>{children}</SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: COLORS.WHITE,
    padding: 22,
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
