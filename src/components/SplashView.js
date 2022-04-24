import React from 'react';
import LottieView from 'lottie-react-native';

export default SplashView = () => {
  const source = require('../../assets/splash.json');
  return <LottieView source={source} autoPlay loop />;
};
