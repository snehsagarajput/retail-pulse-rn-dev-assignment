import React from 'react';
import {StyleSheet, KeyboardAvoidingView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useHeaderHeight} from '@react-navigation/elements';
import {isIOS} from '../utils/utils';

export default SafeView = (props) => {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight}
      behavior={isIOS ? 'padding' : 'height'}
      style={[styles.container, props.style]}>
      <SafeAreaView style={[styles.container, props.style]}>
        {props.children}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
