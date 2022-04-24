import React, {useState} from 'react';
import {
  TextInput,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {COLORS, MARGINS} from '../styles/designValues';
import {MIN_LENGTH} from '../utils/constants';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loader from './Loader';
import {captureError} from '../utils/utils';
import {Icon} from 'react-native-eva-icons';
import {useBoolean} from '../hooks/useBoolean';

export default Login = () => {
  const [username, setUsername] = useState('ram@gmail.com');
  const [password, setPassword] = useState('retailpulse');
  const [viewPassword, setViewPassword] = useBoolean(false);
  const [loading, setLoading] = useState({state: false, text: ''});

  const isDisabled =
    username?.length < MIN_LENGTH.USER_NAME ||
    password?.length < MIN_LENGTH.PASSWORD;

  const handleLoginPress = () => {
    setLoading({state: true, text: 'Logging in...'});
    auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {})
      .catch((error) => {
        let errorMsg = 'Something went wrong. Please try again.';
        if (error.code === 'auth/invalid-email') {
          errorMsg = 'Please enter a valid email address.';
        } else if (
          ['auth/user-not-found', 'auth/wrong-password'].includes(error.code)
        ) {
          errorMsg = 'You have entered an invalid username or password.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMsg =
            'You have exceed maximum number of requests. Please try again later.';
        } else if (error.code === 'auth/network-request-failed') {
          errorMsg = 'Please check your network connection and try again.';
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
      <ScrollView style={styles.scrollView}>
        <Text style={styles.welcomeMsg}>{'Welcome \nto Retail Pulse'}</Text>
        <Text style={styles.wishMsg}>{'Hope you are well today'}</Text>
        <TextInput
          disableFullscreenUI
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder={'Email'}
          maxLength={254}
          returnKeyType={'next'}
        />
        <View style={[styles.input, {flexDirection: 'row'}]}>
          <TextInput
            disableFullscreenUI
            secureTextEntry={!viewPassword}
            value={password}
            style={{flex: 1}}
            onChangeText={setPassword}
            textContentType={'password'}
            placeholder={'Password'}
            returnKeyType={'done'}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={setViewPassword}>
            <Icon
              name={!viewPassword ? 'eye-off-outline' : 'eye-outline'}
              width={25}
              height={25}
              fill={COLORS.BLACK}
              animation={'pulse'}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={isDisabled}
          style={[
            styles.loginBtn,
            {backgroundColor: COLORS.PRIMARY_BUTTON + (isDisabled ? '66' : '')},
          ]}
          onPress={handleLoginPress}>
          <Text style={styles.loginText}>{'Login'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginHorizontal: MARGINS.HORIZONTAL,
  },
  welcomeMsg: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: '700',
    color: COLORS.BLACK,
    marginTop: '12%',
  },
  wishMsg: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '700',
    color: COLORS.SUBTEXT,
  },
  input: {
    backgroundColor: COLORS.WHITE,
    marginTop: 40,
    minHeight: 45,
    borderColor: COLORS.BORDER,
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  loginBtn: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 40,
    marginBottom: 40,
  },
  loginText: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  eyeBtn: {
    marginLeft: 10,
  },
});
