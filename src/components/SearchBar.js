import React from 'react';
import {TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import {COLORS, MARGINS} from '../styles/designValues';
import {Icon} from 'react-native-eva-icons';
import Animated, {Layout, SlideInRight} from 'react-native-reanimated';

export default SearchBar = ({
  searchText,
  handleSearchText,
  handleSearchClose,
}) => {
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        marginHorizontal: MARGINS.HORIZONTAL,
        backgroundColor: COLORS.WHITE,
        height: 45,
        marginVertical: 10,
        borderRadius: 10,
      }}
      entering={SlideInRight}
      layout={Layout.springify()}>
      <TextInput
        value={searchText}
        onChangeText={handleSearchText}
        placeholder={'Search'}
        style={{
          borderColor: COLORS.WHITE,
          paddingVertical: 10,
          paddingHorizontal: 10,
          fontSize: 16,
          flex: 1,
        }}
      />
      <TouchableOpacity
        onPress={handleSearchClose}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.WHITE,
          minHeight: 45,
          marginRight: 5,
        }}>
        <Icon
          name={'close-outline'}
          width={30}
          height={30}
          fill={COLORS.WARN}
          animation={'pulse'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};
