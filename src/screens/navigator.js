import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SCREENS} from '../utils/constants';
import {COLORS} from '../styles/designValues';

const Stack = createStackNavigator();

const defaultNavigationOptions = {
  headerTitle: '',
  cardStyle: {
    backgroundColor: COLORS.BACKGROUND,
  },
  headerBackTitle: 'Back',
  headerShown: false,
};

export default StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={SCREENS.LOGIN}>
      <Stack.Screen
        name={SCREENS.LOGIN}
        getComponent={() => require('./LoginScreen').default}
        options={{...defaultNavigationOptions}}
      />
      <Stack.Screen
        name={SCREENS.HOME}
        getComponent={() => require('./HomeScreen').default}
        options={{
          ...defaultNavigationOptions,
          cardStyle: {
            backgroundColor: COLORS.HOME_SCREEN_BG,
          },
        }}
      />
    </Stack.Navigator>
  );
};
