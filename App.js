import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import configureStore from './src/redux/store';
import {Provider as ReduxProvider} from 'react-redux';
import {RESET_STATE} from './src/redux/actionType';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/screens/navigator';
import {ToastProvider} from 'react-native-toast-notifications';
import firestore from '@react-native-firebase/firestore';

const store = configureStore(1);

const App = () => {
  LogBox.ignoreLogs([
    'ViewPropTypes will be removed',
    'ColorPropType will be removed',
    'Sending `onAnimatedValueUpdate` with no listeners registered.',
  ]);

  useEffect(() => {
    firestore().settings({
      //add all firestore settings here
      ignoreUndefinedProperties: true,
    });
    return () => {
      store.dispatch({type: RESET_STATE});
    };
  }, []);

  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <ToastProvider>
            <StackNavigator />
          </ToastProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ReduxProvider>
  );
};

export default App;
