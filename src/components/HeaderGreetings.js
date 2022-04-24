import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS} from '../styles/designValues';
import {useConstRef} from '../hooks/useConstRef';
import {getWishMsg, isIOS} from '../utils/utils';
import {Placeholder, PlaceholderLine, Fade} from 'rn-placeholder';

export default HeaderGreetings = () => {
  const wishMsg = useConstRef(getWishMsg());
  const userName = useSelector((state) => state.userStore.name || '');

  return (
    <View>
      <Text style={styles.wishMsg}>{wishMsg}</Text>
      {!userName?.length ? (
        <View style={styles.placeholder}>
          <Placeholder Animation={Fade}>
            <PlaceholderLine width={isIOS ? '40%' : 40} />
          </Placeholder>
        </View>
      ) : (
        <Text style={styles.username}>{userName}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wishMsg: {
    fontSize: 22,
    textAlign: 'left',
    fontWeight: '700',
    color: COLORS.BLACK,
  },
  placeholder: {
    heigth: 20,
    marginTop: 8,
  },
  username: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '400',
    color: COLORS.BLACK,
  },
});
