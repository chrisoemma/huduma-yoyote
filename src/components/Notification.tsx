

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';

const Notification = ({ message, type }:any) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 50000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case 'warning':
        return  'orange';
      case 'info':
        return '#3495eb';
      case 'danger':
        return colors.dangerRed;
      case 'success':
        return colors.successGreen;
      default:
        return 'rgba(0, 0, 0, 0.8)';
    }
  };

  const closeNotification = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={closeNotification} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    margin: 10,
    flexDirection: 'row',
    alignContent:'center',
    alignItems:'center'
  },
  message: {
    color: 'white',
    fontSize:15,
    flex: 1,
    alignSelf:'center'
  },
  closeButton: {
    marginLeft: 8,
    padding: 8,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default Notification;
