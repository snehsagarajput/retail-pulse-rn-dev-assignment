import React, {useState} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {COLORS} from '../styles/designValues';
import {useSelector} from 'react-redux';
import {Icon} from 'react-native-eva-icons';
import ModalComponent from './Modal';
import {FILTER_KEYS, ALL_KEY} from '../utils/constants';
import {getDefaultFilter} from '../utils/utils';

export default Filter = ({onClose, applyFilter}) => {
  const [selectedFilters, setSelectedFilters] = useState(
    useSelector((state) => state.userStore?.currentFilter ?? {}),
  );
  const filterOptions = useSelector(
    (state) => state.userStore?.filterOptions ?? {},
  );
  const {height} = useWindowDimensions();

  const onItemPress = (categoryName, item) => {
    setSelectedFilters((prev) => {
      const prevValues = prev[categoryName];
      const prevIndex = prevValues.findIndex((vals) => item === vals);
      const isPrevIncluded = prevIndex > -1;
      if (
        item === ALL_KEY ||
        (!isPrevIncluded &&
          prevValues.length === filterOptions[categoryName].length - 1)
      ) {
        return {
          ...prev,
          [categoryName]: [ALL_KEY],
        };
      } else if (prevValues.length === 1 && prevValues[0] === ALL_KEY) {
        return {
          ...prev,
          [categoryName]: [item],
        };
      } else if (isPrevIncluded) {
        prevValues.splice(prevIndex, 1);
        return {
          ...prev,
          [categoryName]: !prevValues.length ? [ALL_KEY] : prevValues,
        };
      } else {
        return {
          ...prev,
          [categoryName]: [...prevValues, item],
        };
      }
    });
  };

  return (
    <ModalComponent isVisible={true} onClose={onClose}>
      <View style={{maxHeight: height - 100, minHeight: 200}}>
        <View style={styles.upperView}>
          <Text style={styles.heading}>{'Filter'}</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon
              name={'close-outline'}
              width={30}
              height={30}
              fill={COLORS.BLACK}
              animation={'pulse'}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={{}}>
          {FILTER_KEYS.map((name, idx) => {
            return (
              <View key={`${name}_${idx}`} style={styles.categoryView}>
                <Text style={styles.categoryHeading}>{name}</Text>
                <View style={styles.categoryOptions}>
                  {[ALL_KEY, ...filterOptions[name]].map((option, index) => {
                    const isSelected = selectedFilters[name].includes(option);
                    return (
                      <TouchableOpacity
                        key={`${name}_${option}_${index}`}
                        onPress={() => onItemPress(name, option)}
                        style={[
                          styles.optionsBtn,
                          {
                            backgroundColor: isSelected
                              ? COLORS.WHITE
                              : COLORS.HOME_SCREEN_BG,
                            borderColor: isSelected
                              ? COLORS.PRIMARY_BUTTON
                              : COLORS.HOME_SCREEN_BG,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.optionsText,
                            {
                              color: isSelected
                                ? COLORS.PRIMARY_BUTTON_DARK
                                : COLORS.BLACK,
                            },
                          ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.bottomBtns}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => setSelectedFilters(getDefaultFilter())}>
            <Text style={styles.resetText}>{'Reset'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => applyFilter(selectedFilters)}>
            <Text style={styles.applyText}>{'Apply'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalComponent>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: COLORS.BLACK,
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: 26,
  },
  upperView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryView: {
    marginVertical: 10,
  },
  categoryHeading: {
    color: COLORS.BLACK,
    textTransform: 'capitalize',
    fontWeight: '400',
    fontSize: 20,
    marginBottom: 5,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK + '80',
  },
  applyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  applyBtn: {
    flex: 2,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY_BUTTON,
    marginLeft: 20,
  },
  resetBtn: {
    flex: 1,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.HOME_SCREEN_BG,
  },
  bottomBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    shadowColor: COLORS.HOME_SCREEN_BG,
  },
  optionsBtn: {
    marginRight: 10,
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  optionsText: {
    fontSize: 14,
    textTransform: 'capitalize',
    fontWeight: '300',
  },
});
