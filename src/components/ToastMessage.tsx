// ToastMessage.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon library

const ToastMessage = ({ message, onClose }) => {
  return (
    <View style={styles.container}>
      <Icon name="exclamation-circle" size={20} color="yellow" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name="times" size={25} color="white" style={styles.closeIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red', // Change color as per your design
    padding: 10,
    zIndex: 9999, // Set a high z-index to float above other content
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row', // Align icon and text horizontally
  },
  icon: {
    marginRight: 10,
  },
  message: {
    color: 'white',
    fontSize: 16,
    flex: 1, // Allow message to take remaining space
  },
  closeIcon:{
    marginRight:15
  }
  // closeButton: {
  //   marginLeft:10,
  // },
});

export default ToastMessage;
