import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import SplashView from '../components/SplashView';
import {loadUserAuth} from '../redux/actions/authActions';
import Login from '../components/Login';
import SafeView from '../components/SafeView';
import {SCREENS, MIN_LENGTH} from '../utils/constants';
import {KeyboardAvoidingView} from 'react-native';

export default LoginScreen = ({navigation, route}) => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const dispatch = useDispatch();
  let authSubscription, justLoggedIn;

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
        routes: [
          {
            name: SCREENS.HOME,
            params: {
              justLoggedIn:
                !showSplashScreen ||
                justLoggedIn ||
                route?.params?.justLoggedOut === true,
            },
          },
        ],
      });
    } else {
      justLoggedIn = true;
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
