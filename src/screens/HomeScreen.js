import React, {useEffect, useState} from 'react';
import {View, Text, Alert, TouchableOpacity, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import SplashView from '../components/SplashView';
import {loadUserData} from '../redux/actions/userStoreActions';
import Login from '../components/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEYS} from '../utils/constants';
import {removeUserAuth} from '../redux/actions/authActions';
import {COLORS, MARGINS} from '../styles/designValues';
import {SCREENS} from '../utils/constants';
import SafeView from '../components/SafeView';
import {useConstRef} from '../hooks/useConstRef';
import {getWishMsg, captureError} from '../utils/utils';
import FastImage from 'react-native-fast-image';

export default HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState({state: false, text: ''});
  const wishMsg = useConstRef(getWishMsg());
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.userStore);

  useEffect(() => {
    dispatch(loadUserData());
  }, []);

  const handleLogOutPress = () => {
    const logOut = () => {
      setLoading({state: true, text: 'Logging out...'});
      auth()
        .signOut()
        .then((a) => {
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

  const renderStoreInfo = ({item, index}) => {
    const storeData = item.data;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          marginVertical: 5,
          height: 80,
          borderRadius: 10,
          padding: 5,
          flexDirection: 'row',
          marginHorizontal: MARGINS.HORIZONTAL,
        }}>
        <FastImage
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            marginHorizontal: 5,
            alignSelf: 'center',
          }}
          source={{
            uri: `https://unsplash.it/100/100?image=${100 + index}`,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View
          style={{
            justifyContent: 'space-evenly',
            flexDirection: 'column',
            flex: 3.5,
            paddingHorizontal: 5,
          }}>
          <Text
            numberOfLines={3}
            style={{
              color: COLORS.BLACK,
              textTransform: 'capitalize',
              fontWeight: '600',
            }}>
            {storeData?.name}
          </Text>
          <Text
            style={{
              color: COLORS.LIGHT_GREY,
              fontWeight: '400',
              textTransform: 'capitalize',
            }}>
            {storeData?.area}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-evenly',
            flexDirection: 'column',
            flex: 2.5,
            paddingHorizontal: 5,
          }}>
          <Text
            style={{
              color: COLORS.LIGHT_GREY,
              fontWeight: '300',
              textTransform: 'capitalize',
              textAlign: 'right',
            }}>
            {storeData?.type}
          </Text>
          <Text
            style={{
              color: COLORS.LIGHT_GREY,
              fontWeight: '200',
              textTransform: 'capitalize',
              textAlign: 'right',
            }}>
            <Text>{'⤷'}</Text>
            {storeData?.route}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeView>
      {loading?.state ? <Loader text={loading.text} /> : null}
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
          marginHorizontal: MARGINS.HORIZONTAL,
        }}>
        <View>
          <Text
            style={{
              fontSize: 22,
              textAlign: 'left',
              fontWeight: '700',
              color: COLORS.BLACK,
            }}>
            {wishMsg}
          </Text>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'left',
              fontWeight: '400',
              color: COLORS.BLACK,
            }}>
            {userStoreState?.name || ''}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.PRIMARY_BUTTON,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            width: 90,
          }}
          onPress={handleLogOutPress}>
          <Text style={{fontSize: 14, color: COLORS.WHITE}}>{'Logout'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{flex: 1}}
        data={userStoreState.stores || []}
        keyExtractor={(item) => item.id}
        renderItem={renderStoreInfo}
      />
    </SafeView>
  );
};
