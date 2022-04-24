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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEYS} from '../utils/constants';
import {COLORS, MARGINS} from '../styles/designValues';
import {SCREENS} from '../utils/constants';
import SafeView from '../components/SafeView';
import {useConstRef} from '../hooks/useConstRef';
import {captureError} from '../utils/utils';
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

export default HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState({state: false, text: ''});
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [stores, setStores] = useState([]);
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.userStore);

  useEffect(() => {
    dispatch(loadUserData());
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
      />
    </SafeView>
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
