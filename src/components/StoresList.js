import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, MARGINS, HEIGHTS} from '../styles/designValues';
import {useConstRef} from '../hooks/useConstRef';
import {isIOS} from '../utils/utils';
import FastImage from 'react-native-fast-image';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Fade,
} from 'rn-placeholder';

export default StoresList = ({isLoading, stores, onItemPress}) => {
  const emptyArray = useConstRef(() => Array.apply(null, Array(12)));

  const renderStoreInfo = ({item, index}) => {
    const storeData = item.data;
    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={() => onItemPress(item)}>
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
      </TouchableOpacity>
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
              <PlaceholderLine width={isIOS ? '90%' : 90} />
              <PlaceholderLine width={isIOS ? '30%' : 50} />
            </View>
          )}>
          <View style={{flex: 7}}>
            <PlaceholderLine width={isIOS ? '60%' : 60} />
            <PlaceholderLine width={isIOS ? '40%' : 30} />
          </View>
        </Placeholder>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.flatList}
      data={isLoading ? emptyArray : stores}
      keyExtractor={(item, index) => `${item?.id || index.toString()}_element`}
      ListEmptyComponent={() => (
        <Text style={styles.noStores}>{'No Store Found'}</Text>
      )}
      getItemLayout={(_, index) => ({
        length: HEIGHTS.STORE_ITEM + 20,
        offset: (HEIGHTS.STORE_ITEM + 20) * index,
        index,
      })}
      renderItem={isLoading ? renderPlaceHolder : renderStoreInfo}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
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
    height: HEIGHTS.STORE_ITEM,
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
});
