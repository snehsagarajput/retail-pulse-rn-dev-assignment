import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import SplashView from '../components/SplashView';
import {loadUserAuth} from '../redux/actions/authActions';
import Login from '../components/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEYS} from '../utils/constants';
import SafeView from '../components/SafeView';
import {SCREENS, MIN_LENGTH} from '../utils/constants';
import {KeyboardAvoidingView} from 'react-native';

export default LoginScreen = ({navigation}) => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const uid = useSelector((state) => state.auth.uid);
  const dispatch = useDispatch();
  let authSubscription;

  const unsubscribeAuthListener = () => {
    if (typeof authSubscription === 'function') {
      authSubscription();
    }
  };

  const onAuthStateChanged = (user) => {
    if (user?.uid) {
      dispatch(loadUserAuth(user));
      unsubscribeAuthListener();
      navigation.reset({
        index: 0,
        routes: [{name: SCREENS.HOME}],
      });
    } else {
      setShowSplashScreen(false);
    }
  };

  useEffect(() => {
    authSubscription = auth().onAuthStateChanged(onAuthStateChanged);
    return unsubscribeAuthListener; // unsubscribe on unmount
  }, []);

  if (showSplashScreen) {
    return <SplashView />;
  }

  return (
    <SafeView>
      <Login />
    </SafeView>
  );
};
