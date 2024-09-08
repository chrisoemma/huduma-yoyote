import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';


const VerticalTabs = ({ tabs, activeTab, onTabPress, isDarkMode }: any) => {
  const selectedLanguage = useSelector(selectLanguage);

  return (
    <ScrollView style={[styles.tabsContainer]}>
      {tabs?.map((tab: any, index: any) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tabItem,
            activeTab === tab?.id && styles.activeTabItem,
          ]}
          onPress={() => onTabPress(tab?.id)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab?.id && styles.activeTabText,
          ]}>
            {selectedLanguage === 'en' ? tab?.name?.en : tab?.name?.sw}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: '#f0f0f0',
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  activeTabItem: {
    backgroundColor: '#e0e0e0', // Highlighted background color for active tab
    borderBottomWidth: 2, // Optional: thicker bottom border for active tab
    borderBottomColor: colors.primary, // Change to your highlight color
  },
  tabText: {
    fontSize: 16,
    color: colors.black,
    fontFamily: 'Prompt-Regular',
  },
  activeTabText: {
    fontFamily: 'Prompt-Bold',
    color: colors.primary,
  },
});

export default VerticalTabs;
