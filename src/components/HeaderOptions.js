import React, {useRef} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {COLORS, MARGINS} from '../styles/designValues';
import {Icon} from 'react-native-eva-icons';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {removeUserAuth} from '../redux/actions/authActions';
import {SCREENS} from '../utils/constants';
import {captureError} from '../utils/utils';

const HeaderOptions = ({
  handleSearchPress,
  handleFilterPress,
  setLoading,
  navigation,
}) => {
  const [searchRef, filterRef, logoutRef] = [useRef(), useRef(), useRef()];
  const dispatch = useDispatch();

  const searchAction = () => {
    searchRef?.current?.startAnimation?.();
    handleSearchPress();
  };

  const filterAction = () => {
    filterRef?.current?.startAnimation?.();
    handleFilterPress();
  };

  const logoutAction = () => {
    logoutRef?.current?.startAnimation?.();
    const logOut = () => {
      setLoading({state: true, text: 'Logging out...'});
      auth()
        .signOut()
        .then(() => {
          dispatch(removeUserAuth());
          navigation.reset({
            index: 0,
            routes: [{name: SCREENS.LOGIN}],
          });
        })
        .catch(captureError)
        .finally(() => {
          setLoading({state: false, text: ''});
        });
    };
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: logOut,
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.options}>
      <TouchableOpacity onPress={searchAction}>
        <Icon
          ref={searchRef}
          name={'search-outline'}
          width={26}
          height={26}
          fill={COLORS.OPTIONS}
          animation={'pulse'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={filterAction}>
        <Icon
          ref={filterRef}
          name={'funnel-outline'}
          width={26}
          height={26}
          fill={COLORS.OPTIONS}
          animation={'pulse'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={logoutAction}>
        <Icon
          ref={logoutRef}
          name={'power-outline'}
          width={24}
          height={24}
          fill={COLORS.WARN}
          animation={'pulse'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 90,
  },
});

export default React.memo(HeaderOptions);
