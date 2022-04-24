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
      style={styles.container}
      entering={SlideInRight}
      layout={Layout.springify()}>
      <TextInput
        autoFocus
        disableFullscreenUI
        value={searchText}
        onChangeText={handleSearchText}
        placeholder={'Search'}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSearchClose} style={styles.closeIcon}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: MARGINS.HORIZONTAL,
    backgroundColor: COLORS.WHITE,
    height: 45,
    marginVertical: 10,
    borderRadius: 10,
  },
  input: {
    borderColor: COLORS.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    flex: 1,
  },
  closeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    minHeight: 45,
    marginRight: 5,
  },
});
