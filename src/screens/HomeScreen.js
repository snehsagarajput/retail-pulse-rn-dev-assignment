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
import {removeUserAuth} from '../redux/actions/authActions';
import {COLORS, MARGINS} from '../styles/designValues';
import {SCREENS} from '../utils/constants';
import SafeView from '../components/SafeView';
import {useConstRef} from '../hooks/useConstRef';
import {getWishMsg, captureError} from '../utils/utils';
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

export default HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState({state: false, text: ''});
  const [searchActive, setSearchActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [stores, setStores] = useState([]);
  const wishMsg = useConstRef(getWishMsg());
  const emptyArray = useConstRef(() => Array.apply(null, Array(12)));
  const dispatch = useDispatch();
  const userStoreState = useSelector((state) => state.userStore);
  const logoutRef = useRef();

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

  const handleLogOutPress = () => {
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

  const renderStoreInfo = ({item, index}) => {
    const storeData = item.data;
    return (
      <View style={styles.listItemContainer}>
        <FastImage
          style={styles.logoImage}
          source={{
            uri: `https://unsplash.it/100/100?image=${100 + index}`,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={[styles.contentView, {flex: 3.5}]}>
          <Text numberOfLines={3} style={styles.name}>
            {storeData?.name}
          </Text>
          <Text style={styles.area}>{storeData?.area}</Text>
        </View>
        <View style={[styles.contentView, {flex: 2.5}]}>
          <Text style={styles.type}>{storeData?.type}</Text>
          <Text style={styles.route}>
            <Text>{'⤷'}</Text>
            {storeData?.route}
          </Text>
        </View>
      </View>
    );
  };

  const renderPlaceHolder = () => {
    return (
      <View style={[styles.listItemContainer, {alignItems: 'center'}]}>
        <Placeholder
          Animation={Fade}
          Left={() => (
            <View style={styles.logoImage}>
              <PlaceholderMedia />
            </View>
          )}
          Right={() => (
            <View style={{flex: 0.4}}>
              <PlaceholderLine width={'90%'} />
              <PlaceholderLine width={'30%'} />
            </View>
          )}>
          <View style={{flex: 7}}>
            <PlaceholderLine width={'60%'} />
            <PlaceholderLine width={'40%'} />
          </View>
        </Placeholder>
      </View>
    );
  };

  return (
    <SafeView>
      {loading?.state ? <Loader text={loading.text} /> : null}
      <View style={styles.container}>
        <View>
          <Text style={styles.wishMsg}>{wishMsg}</Text>
          {!userStoreState?.name?.length ? (
            <View style={{heigth: 20, marginTop: 8}}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={'40%'} />
              </Placeholder>
            </View>
          ) : (
            <Text style={styles.username}>{userStoreState.name}</Text>
          )}
        </View>
        <View style={styles.options}>
          <TouchableOpacity onPress={handleSearchPress}>
            <Icon
              name={'search-outline'}
              width={26}
              height={26}
              fill={COLORS.OPTIONS}
              animation={'pulse'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFilterPress}>
            <Icon
              name={'funnel-outline'}
              width={26}
              height={26}
              fill={COLORS.OPTIONS}
              animation={'pulse'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogOutPress}>
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
      </View>
      {searchActive ? (
        <SearchBar
          searchText={searchText}
          handleSearchText={handleSearchText}
          handleSearchClose={handleSearchClose}
        />
      ) : null}
      <FlatList
        style={{flex: 1}}
        data={
          userStoreState.isLoading
            ? emptyArray
            : searchActive && searchText?.length
            ? stores
            : userStoreState.stores
        }
        keyExtractor={(item, index) =>
          `${item?.id || index.toString()}_element`
        }
        ListEmptyComponent={() => (
          <Text style={styles.noStores}>{'No Store Found'}</Text>
        )}
        renderItem={
          userStoreState.isLoading ? renderPlaceHolder : renderStoreInfo
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
  username: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '400',
    color: COLORS.BLACK,
  },
  wishMsg: {
    fontSize: 22,
    textAlign: 'left',
    fontWeight: '700',
    color: COLORS.BLACK,
  },
  noStores: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: '10%',
  },
  listItemContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    marginVertical: 5,
    height: 80,
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
    marginHorizontal: MARGINS.HORIZONTAL,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 5,
    alignSelf: 'center',
  },
  contentView: {
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    paddingHorizontal: 5,
  },
  name: {
    color: COLORS.BLACK,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  area: {
    color: COLORS.LIGHT_GREY,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  type: {
    color: COLORS.LIGHT_GREY,
    fontWeight: '300',
    textTransform: 'capitalize',
    textAlign: 'right',
  },
  route: {
    color: COLORS.LIGHT_GREY,
    fontWeight: '200',
    textTransform: 'capitalize',
    textAlign: 'right',
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 90,
  },
});
