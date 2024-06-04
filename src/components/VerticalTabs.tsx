import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';


const VerticalTabs = ({ tabs, activeTab, onTabPress, isDarkMode }: any) => {
  const selectedLanguage = useSelector(selectLanguage);

  return (
    <ScrollView style={styles.tabsContainer}>
      {tabs?.map((tab: any, index: any) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tabItem,
            activeTab === tab?.id && styles.activeTabItem,
            { backgroundColor: isDarkMode ? colors.dark : colors.light },
          ]}
          onPress={() => onTabPress(tab?.id)}
        >
          <Text style={{ fontSize: 16, color: colors.black }}>
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
    backgroundColor: '#fff',
  },
});

export default VerticalTabs;
