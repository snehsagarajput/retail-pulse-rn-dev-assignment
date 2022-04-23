import React, {useState, useEffect} from 'react';
import {
  TextInput,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {COLORS, MARGINS} from '../styles/designValues';
import {SCREENS, MIN_LENGTH} from '../utils/constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loader from './Loader';
import {captureError} from '../utils/utils';

export default Login = () => {
  const [username, setUsername] = useState('ram@gmail.com');
  const [password, setPassword] = useState('retailpulse');
  const [loading, setLoading] = useState({state: false, text: ''});

  const isDisabled =
    username?.length < MIN_LENGTH.USER_NAME ||
    password?.length < MIN_LENGTH.PASSWORD;

  const handleLoginPress = () => {
    setLoading({state: true, text: 'Logging in...'});
    auth()
      .signInWithEmailAndPassword(username, password)
      .then((user) => {})
      .catch((error) => {
        let errorMsg = 'Something went wrong. Please try again.';
        if (error.code === 'auth/invalid-email') {
          errorMsg = 'Please enter a valid email address.';
        } else if (
          ['auth/user-not-found', 'auth/wrong-password'].includes(error.code)
        ) {
          errorMsg = 'You have entered an invalid username or password.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMsg = 'You have entered an invalid username or password.';
        } else {
          captureError(error);
          errorMsg =
            'Something went wrong. Please try again. Error Code : ' +
            error.code;
        }
        Alert.alert('Login Error', errorMsg);
      })
      .finally(() => {
        setLoading({state: false, text: ''});
      });
  };

  return (
    <>
      {loading?.state ? <Loader showDelay text={loading.text} /> : null}
      <ScrollView style={{flex: 1, marginHorizontal: MARGINS.HORIZONTAL}}>
        <Text
          style={{
            fontSize: 40,
            textAlign: 'center',
            fontWeight: '700',
            color: COLORS.BLACK,
            marginTop: '12%',
          }}>
          {'Welcome \nto Retail Pulse'}
        </Text>
        <Text
          style={{
            fontSize: 16,
            marginTop: 10,
            textAlign: 'center',
            fontWeight: '700',
            color: COLORS.SUBTEXT,
          }}>
          {'Hope you are well today'}
        </Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={{
            backgroundColor: COLORS.WHITE,
            marginTop: 40,
            minHeight: 45,
            borderColor: COLORS.BORDER,
            borderBottomWidth: 1,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
          placeholder={'Email'}
          maxLength={254}
          returnKeyType={'next'}
        />
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: COLORS.WHITE,
            marginTop: 40,
            minHeight: 45,
            borderColor: COLORS.BORDER,
            borderBottomWidth: 1,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
          textContentType={'password'}
          placeholder={'Password'}
          returnKeyType={'done'}
        />
        <TouchableOpacity
          disabled={isDisabled}
          style={{
            backgroundColor: isDisabled
              ? COLORS.PRIMARY_BUTTON + '66'
              : COLORS.PRIMARY_BUTTON,
            minHeight: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            marginTop: 40,
          }}
          onPress={handleLoginPress}>
          <Text style={{fontSize: 24, color: COLORS.WHITE}}>{'Login'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};
