import React, {useEffect} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {COLORS} from '../styles/designValues';
import {DELAY_LOADING_TIME} from '../utils/constants';
import {useBoolean} from '../hooks/useBoolean';

export default Loader = ({text, showDelay = false}) => {
  const [showDelayMsg, setShowDelayMsg] = useBoolean(false);

  useEffect(() => {
    if (showDelay) {
      const timeout = setTimeout(setShowDelayMsg, DELAY_LOADING_TIME);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        position: 'absolute',
        height: '80%',
        width: '100%', //relative to parent
      }}>
      <ActivityIndicator size={'large'} color={COLORS.BLACK} />
      <Text
        style={{
          color: COLORS.BLACK,
          fontSize: 14,
          padding: 10,
          textAlign: 'center',
          fontWeight: 'bold',
          elevation: 10,
        }}>
        {showDelayMsg
          ? "It's taking longer than usual. Please check your Internet Connection."
          : text?.length
          ? text
          : ''}
      </Text>
    </View>
  );
};
