import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {loadUserData} from '../redux/actions/userStoreActions';
import {COLORS, MARGINS} from '../styles/designValues';
import {SCREENS} from '../utils/constants';
import SafeView from '../components/SafeView';
import {useConstRef} from '../hooks/useConstRef';
import FastImage from 'react-native-fast-image';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Fade,
} from 'rn-placeholder';
import {Icon} from 'react-native-eva-icons';
import Animated, {Layout, SlideInRight} from 'react-native-reanimated';
import {debounce} from 'lodash';
import SearchBar from '../components/SearchBar';
import HeaderOptions from '../components/HeaderOptions';
import HeaderGreetings from '../components/HeaderGreetings';
import StoresList from '../components/StoresList';
import {isEmpty} from 'lodash';
import SelectedStore from '../components/SelectedStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEYS} from '../utils/constants';
import {USER_STORE} from '../redux/actionType';
import {captureError, uploadPendingImages} from '../utils/utils';

export default HomeScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState({state: false, text: ''});
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [stores, setStores] = useState([]);
  const userStoreState = useSelector((state) => state.userStore);
  const uid = useSelector((state) => state.auth.uid);
  const dispatch = useDispatch();
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    dispatch(loadUserData());

    const work = () =>
      AsyncStorage.getItem(ASYNC_STORAGE_KEYS.PENDING_IMAGES)
        .then((res) => {
          if (res) {
            const pendingImages = JSON.parse(res);
            if (!isEmpty(pendingImages)) {
              dispatch({
                type: USER_STORE.UPDATE_PENDING_IMAGES,
                payload: {pendingImages},
              });
              uploadPendingImages(pendingImages, uid, dispatch);
            }
          }
        })
        .catch(captureError);
    if (route?.params?.justLoggedIn) {
      AsyncStorage.getItem(ASYNC_STORAGE_KEYS.LAST_LOGGED_IN_UID).then(
        (val) => {
          if (val != null && uid === val) {
            work();
          } else {
            AsyncStorage.setItem(ASYNC_STORAGE_KEYS.LAST_LOGGED_IN_UID, uid);
          }
        },
      );
    } else {
      work();
    }
  }, []);

  const delayedQuery = debounce((text) => {
    setStores(
      userStoreState.stores.filter((store) => {
        const query = text.toLowerCase();
        return (
          (store?.data?.name?.toLowerCase?.() || '').includes(query) ||
          (store?.data?.area?.toLowerCase?.() || '').includes(query) ||
          (store?.data?.route?.toLowerCase?.() || '').includes(query) ||
          (store?.data?.type?.toLowerCase?.() || '').includes(query)
        );
      }),
    );
  }, 400);

  const handleStorePress = (item) => {
    setSelectedStore(item);
  };

  const handleStorePressClose = () => {
    setSelectedStore(null);
  };

  const handleSearchText = (text) => {
    setSearchText(text);
    delayedQuery(text);
  };

  const handleSearchPress = () => {
    if (filterActive) {
      handleFilterClose();
    }
    if (!searchActive) {
      setSearchActive(true);
      setSearchText('');
      setStores([]);
    }
  };

  const handleSearchClose = () => {
    setSearchActive(false);
    setSearchText('');
    setStores([]);
  };

  const handleFilterPress = () => {
    if (searchActive) {
      handleSearchClose();
    }
    setFilterActive(true);
  };

  const handleFilterClose = () => {
    setFilterActive(false);
    setStores([]);
  };

  return (
    <>
      <SafeView>
        {loading?.state ? <Loader text={loading.text} /> : null}
        <View style={styles.container}>
          <HeaderGreetings />
          <HeaderOptions
            setLoading={setLoading}
            navigation={navigation}
            handleSearchPress={handleSearchPress}
            handleFilterPress={handleFilterPress}
          />
        </View>
        {searchActive ? (
          <SearchBar
            searchText={searchText}
            handleSearchText={handleSearchText}
            handleSearchClose={handleSearchClose}
          />
        ) : null}
        <StoresList
          isLoading={userStoreState.isLoading}
          stores={
            searchActive && searchText?.length ? stores : userStoreState.stores
          }
          onItemPress={handleStorePress}
        />
      </SafeView>
      {selectedStore ? (
        <SelectedStore
          selectedStore={selectedStore}
          onClose={handleStorePressClose}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: MARGINS.HORIZONTAL,
  },
});
