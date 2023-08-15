import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const VerticalTabs = ({ tabs, activeTab, onTabPress }:any) => {
  return (
    <ScrollView style={styles.tabsContainer}>
      {tabs.map((tab:any, index:any) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tabItem,
            activeTab === index && styles.activeTabItem,
          ]}
          onPress={() => onTabPress(index)}
        >
          <Text style={styles.tabText}>{tab.name}</Text>
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
  tabText: {
    fontSize: 16,
  },
});

export default VerticalTabs;
