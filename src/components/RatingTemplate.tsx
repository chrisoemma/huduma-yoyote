// RatingTemplate.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import _ from 'lodash';

const RatingTemplate = ({ options, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Debounce the onSelect callback
  const debouncedOnSelect = useCallback(_.debounce(onSelect, 300), [onSelect]);

  const toggleOption = (option) => {
    setSelectedOptions(prevSelected => {
      const isSelected = prevSelected.some(selected => selected.id === option.id);
      const newSelected = isSelected
        ? prevSelected.filter(item => item.id !== option.id)
        : [...prevSelected, option];

      debouncedOnSelect(newSelected); 
      return newSelected;
    });
  };

  // Reset selected options when options change
  useEffect(() => {
    setSelectedOptions([]);
  }, [options]);

  return (
    <View style={styles.container}>
      {options.map(option => (
        <TouchableOpacity
          key={option.id}
          onPress={() => toggleOption(option)}
          style={[
            styles.option,
            selectedOptions.some(selected => selected.id === option.id) && styles.selectedOption
          ]}
        >
          <Text style={styles.optionText}>{option.reason}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
   justifyContent: 'center',
  },
  option: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: '#000',
  }
});

export default RatingTemplate;
