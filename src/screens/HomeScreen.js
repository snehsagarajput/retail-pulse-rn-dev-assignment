import React, {useEffect, useState, useReducer} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  loadUserData,
  updateCurrentFilter,
  activateImagesListener,
} from '../redux/actions/userStoreActions';
import {MARGINS} from '../styles/designValues';
import SafeView from '../components/SafeView';
import SearchBar from '../components/SearchBar';
import HeaderOptions from '../components/HeaderOptions';
import HeaderGreetings from '../components/HeaderGreetings';
import StoresList from '../components/StoresList';
import Filter from '../components/Filter';
import SelectedStore from '../components/SelectedStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEYS} from '../utils/constants';
import {USER_STORE} from '../redux/actionType';
import {isIOS, captureError, uploadPendingImages} from '../utils/utils';
import {isEmpty, isEqual, debounce} from 'lodash';
import Loader from '../components/Loader';

export default HomeScreen = ({navigation, route}) => {
  const [loading, setLoading] = useState({state: false, text: ''});
  const [searchActive, setSearchActive] = useReducer((prev) => !prev, false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [stores, setStores] = useState([]);
  const userStores = useSelector(
    (state) => state.userStore?.filteredStore || [],
  );
  const currentFilter = useSelector(
    (state) => state.userStore?.currentFilter || {},
  );
  const isFetching = useSelector((state) => state.userStore?.isLoading);
  const uid = useSelector((state) => state.auth.uid);
  const [selectedStore, setSelectedStore] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserData()); //fetch user stores
    dispatch(activateImagesListener());

    const getSetPendingImages = () =>
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
      //if user has just logged in
      AsyncStorage.getItem(ASYNC_STORAGE_KEYS.LAST_LOGGED_IN_UID).then(
        (val) => {
          if (val != null && uid === val) {
            //if same user whose images were pending to be uploaded logged in again
            getSetPendingImages();
          } else {
            //different user logged in
            AsyncStorage.multiSet([
              [ASYNC_STORAGE_KEYS.LAST_LOGGED_IN_UID, uid],
              [ASYNC_STORAGE_KEYS.PENDING_IMAGES, ''],
            ]);
          }
        },
      );
    } else {
      //if app opened
      getSetPendingImages();
    }
    const handleBackPress = () => {
      console.log('back pressed', searchActive);
      if (searchActive) {
        handleSearchClose();
        return true;
      }
      return false;
    };
    if (!isIOS) {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    }
    return () => {
      if (!isIOS) {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    };
  }, []);

  const delayedQuery = debounce((text) => {
    setStores(
      userStores.filter((store) => {
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
    if (isFetching) {
      return;
    }
    if (filterActive) {
      handleFilterClose();
    }
    if (!searchActive) {
      setSearchActive();
      setSearchText('');
      setStores([]);
    }
  };

  const handleSearchClose = () => {
    setSearchActive();
    setSearchText('');
    setStores([]);
  };

  const handleFilterPress = () => {
    if (isFetching) {
      return;
    }
    if (searchActive) {
      handleSearchClose();
    }
    setFilterActive(true);
  };

  const handleFilterClose = () => {
    setFilterActive(false);
    setStores([]);
  };

  const applyFilter = (filter) => {
    handleFilterClose();
    if (!isEqual(currentFilter, filter)) {
      dispatch(updateCurrentFilter(filter));
    }
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
          isLoading={isFetching}
          stores={searchActive && searchText?.length ? stores : userStores}
          onItemPress={handleStorePress}
        />
      </SafeView>
      {selectedStore ? (
        <SelectedStore
          selectedStore={selectedStore}
          onClose={handleStorePressClose}
        />
      ) : null}
      {filterActive && !isFetching ? (
        <Filter onClose={handleFilterClose} applyFilter={applyFilter} />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: MARGINS.HORIZONTAL,
  },
});
