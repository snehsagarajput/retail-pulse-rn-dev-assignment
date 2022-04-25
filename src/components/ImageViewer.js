import React from 'react';
import ImageView from 'react-native-image-viewing';

export default ImageViewer = ({images, onClose}) => {
  return (
    <ImageView
      images={images}
      imageIndex={0}
      visible={true}
      onRequestClose={onClose}
    />
  );
};
