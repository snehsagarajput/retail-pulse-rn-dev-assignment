import React from 'react';
import {StyleSheet, KeyboardAvoidingView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HeaderHeightContext} from '@react-navigation/stack';

export default SafeView = (props) => {
  return (
    <KeyboardAvoidingView
      behavior={'padding'}
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
